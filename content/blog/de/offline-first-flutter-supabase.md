---
title: "Offline-First mit Flutter und Supabase: Outbox statt Ladebalken"
description: "Wie MoneyKoi offline-first mit Flutter und Supabase arbeitet: SQLite als Quelle der Wahrheit, eine Outbox mit Wiederholungen und ein einziger Delta-Sync."
date: 2026-10-31
slug: offline-first-flutter-supabase
key: offline-first-flutter-supabase
tags: [Flutter, Supabase, Offline-First]
keywords: [Flutter Offline First, Supabase Sync Flutter, Outbox Pattern Flutter, Flutter SQLite Sync, Offline App entwickeln]
cover: /images/blog/offline-first-flutter-supabase/cover.de.webp
projects: [moneykoi]
---

Ein Haushaltsbuch wird an der Supermarktkassa geöffnet, im Keller oder im Ausland – also genau dort, wo das Netz schlecht ist. Für MoneyKoi habe ich die Flutter-App deshalb offline-first gebaut: Die UI liest und schreibt nur in eine lokale SQLite-Datenbank, eine Outbox schickt Änderungen im Hintergrund an Supabase, und ein einziger Delta-Sync holt die Änderungen der anderen Geräte. Beim Buchen gibt es keinen Ladebalken, und Buchen, Scannen und Auswertungen funktionieren auch im Flugmodus.

## Woher die Anforderung kommt

MoneyKoi ist mein eigenes Produkt, ein Haushaltsbuch für Android und das Web ([zum Projekt](/projects/moneykoi)). Im Free-Plan gibt es gar keinen Server: Das ganze Buch liegt am Handy. Mit dem Cloud-Plan teilt sich ein Haushalt ein Buch über mehrere Handys, Tablets und den Browser, in Echtzeit.

Daraus habe ich drei Regeln abgeleitet:

- Eine Buchung ist fertig, sobald sie lokal gespeichert ist, nicht erst, wenn der Server sie bestätigt.
- Lesen geht nie übers Netz.
- Daten vom Server kommen auf genau einem Weg in die App.

Die dritte Regel taucht weiter unten mehrmals wieder auf.

## SQLite ist die Quelle der Wahrheit

Jede synchronisierte Tabelle gibt es zweimal: in PostgreSQL bei Supabase und als Spiegel in SQLite am Gerät. Die UI liest aus einem kleinen In-Memory-Cache und bei einem Cache-Miss aus SQLite. Eine normale Leseabfrage macht nie einen Netzwerk-Request.

Damit das ohne Server funktioniert, braucht es zwei Festlegungen:

- **IDs erzeugt der Client.** Jede Zeile bekommt beim Anlegen eine UUID am Gerät. Sie bleibt auf allen Geräten gleich, und eine Buchung kann auf eine Kategorie verweisen, die der Server noch nie gesehen hat.
- **Zeitstempel gehören dem Server.** `created_at` und `updated_at` setzt ein Trigger in Postgres. Die App schickt sie nie mit und übernimmt sie erst aus der Antwort.

Jede lokale Zeile hat außerdem einen Sync-Status, der nie zum Server geht: `createdLocally`, `updatedLocally` oder `pendingDelete`, bis der Push durch ist, dann `synced`. Nach drei Fehlversuchen wird daraus `upsertFailed` oder `deleteFailed`, und die Zeile behält ihre Daten. Eine gelöschte, aber noch nicht übertragene Zeile filtert jede Abfrage sofort aus. In der App ist sie weg, auch wenn der Server noch nichts davon weiß.

![Neue Ausgabe in MoneyKoi mit Betrag, Datum und Konto, oben in der Statusleiste das Flugmodus-Symbol](/images/blog/offline-first-flutter-supabase/new-expense-airplane-mode.webp){width="320" height="711"}

## Die Outbox: Schreiben ist sofort fertig

Ein `save()` macht zwei Dinge: Es schreibt die Zeile in SQLite und legt einen Eintrag in die Outbox, eine Tabelle `queue_items` in derselben Datenbank. Der Eintrag enthält einen eingefrorenen Schnappschuss der Zeile zum Zeitpunkt des Schreibens. Damit übersteht die Outbox einen App-Neustart und einen leeren Akku.

Abgearbeitet wird streng seriell, ein Eintrag nach dem anderen, nach drei Regeln:

1. **Pro Datensatz höchstens ein Eintrag.** Wer eine Buchung fünfmal hintereinander ändert, erzeugt nicht fünf Requests. Der neue Eintrag ersetzt den alten, gesendet wird nur der letzte Stand.
2. **Löschungen nach vorne.** Ein Delete kommt an den Anfang der Warteschlange, Upserts hinten dran. Eine fortlaufende Sequenznummer hält die Reihenfolge auch über einen Neustart.
3. **Wiederholen, dann pausieren.** Bei einem Netzwerkfehler versucht es die Outbox dreimal im Abstand von zwei Sekunden und pausiert den Eintrag dann, bis die Verbindung zurück ist. Bei einem echten Fehler, etwa einer RLS-Ablehnung, gibt es ebenfalls drei Versuche. Danach bleibt der Eintrag pausiert und bekommt beim nächsten App-Start eine neue Chance.

Das Zusammenfassen sieht vereinfacht so aus:

```dart
Future<void> coalesceAndEnqueue(QueueItem item) async {
  // The head may be in flight right now – never replace it.
  final protectHead = isProcessing && queue.isNotEmpty && queue.first.entityId == item.entityId;

  final kept = <QueueItem>[];
  for (final (i, queued) in queue.indexed) {
    if ((protectHead && i == 0) || queued.entityId != item.entityId) {
      kept.add(queued);
    }
  }

  if (item.isDelete) {
    kept.insert(protectHead ? 1 : 0, item);
  } else {
    kept.add(item);
  }

  // Commit in memory first, with no await in between.
  queue
    ..clear()
    ..addAll(kept);

  // INSERT OR REPLACE keyed on entity_id: no delete-then-insert window.
  await store.upsert(item);
}
```

Zwei Details darin stammen aus Fehlern in früheren Versionen.

Der Eintrag, der gerade gesendet wird, darf nicht ersetzt werden. Kommt währenddessen eine neuere Version, gewinnt nach dem Senden die neuere, und der alte Kopf wird verworfen.

Die neue Warteschlange wird ohne `await` dazwischen gebaut und übernommen. Eine frühere Version hat zuerst einen Schnappschuss gemacht, dann auf die Datenbank gewartet und danach aus dem veralteten Schnappschuss neu gebaut. War der Kopf in dieser Zeit fertig geworden, stand er wieder in der Liste und wurde ein zweites Mal gesendet. Ähnlich beim Speichern: Statt erst zu löschen und dann einzufügen, gibt es nur noch ein `INSERT OR REPLACE`. Wird die App zwischen zwei Schritten beendet, fehlt sonst der Eintrag ganz.

## Ein einziger Delta-Sync zu Supabase

In die andere Richtung gibt es genau einen Weg: die Postgres-Funktion `sync_all`, aufgerufen als RPC. Die App schickt pro Datentyp einen Cursor mit, und der Server liefert pro Typ die geänderten Zeilen (`upserts`), die gelöschten IDs (`deletes`) und einen neuen Cursor.

Vor jedem Pull wartet die App, bis die Outbox des aktiven Buchs abgearbeitet ist, höchstens zehn Sekunden. Sonst wäre das Delta älter als die eigenen, noch nicht gesendeten Änderungen.

### Der Cursor braucht die ID

Ursprünglich war der Cursor ein Zeitstempel: „gib mir alles mit `updated_at` nach X“. Das hatte zwei Probleme.

Erstens kam ein großes Buch beim ersten Sync in einem einzigen Statement. Bei Büchern mit Jahren an Historie lief das in das Statement-Timeout der `authenticated`-Rolle von 8 Sekunden. Heute liefert `sync_all` Seiten mit höchstens 1.000 Zeilen pro Typ.

Zweitens haben alle Zeilen, die in einer Transaktion geschrieben werden, denselben Zeitstempel, weil `NOW()` den Beginn der Transaktion liefert. Eine Wiederherstellung aus einem Backup schreibt ein ganzes Buch in einer Transaktion. Mit einem reinen Zeitstempel-Cursor springt die nächste Seite über den Rest dieser Gruppe oder kommt nie darüber hinaus. In einem Test mit einer wiederhergestellten Gruppe von 20.000 Zeilen kamen so nach sieben Seiten 11.600 von 30.000 Buchungen an.

Die Lösung ist ein Keyset-Cursor aus `(updated_at, id)`:

```sql
CREATE INDEX IF NOT EXISTS idx_booking_sync_walk
  ON public.booking (tenant_id, updated_at, id);

SELECT *
FROM public.booking
WHERE tenant_id = p_tenant_id
  AND (updated_at, id) > (p_cursor, p_after_id)
ORDER BY updated_at, id
LIMIT p_limit;
```

Der Zeilenvergleich `(a, b) > (x, y)` ist lexikografisch und läuft über den Index, jede Seite liest also nur die Zeilen, die sie zurückgibt. Solange ein Durchlauf nicht fertig ist, speichert die App beide Hälften des Cursors. Danach bleibt ein normaler Zeitstempel übrig, und ein alltäglicher Sync ist wieder ein einziger Aufruf. Ein Cursor ohne ID wird als `(cursor, ffffffff-…)` gelesen, also als das alte `updated_at > cursor`. Ältere App-Versionen schicken kein Limit und bekommen das Delta wie bisher in einem Stück.

### Eigene Änderungen nicht doppelt laden

Was die App selbst gepusht hat, käme beim nächsten Pull wieder zurück. Deshalb schickt sie die IDs der Zeilen mit, die sie seit dem letzten Cursor selbst gesendet hat (`excludeIds`). Der Server filtert damit nur Upserts, nie Löschungen. Eine frühere Version hat beides gefiltert. Hatte dieses Gerät eine Zeile kurz vorher geändert und ein anderes sie dann gelöscht, ging die Löschung verloren: Der Cursor zog daran vorbei, und die Zeile blieb für immer am Handy.

### Der Pull überschreibt keine offenen Änderungen

Beim Anwenden eines Deltas überspringt die App jede Zeile, die lokal noch der Outbox gehört (alles außer `synced`), und jede, deren lokales `updated_at` neuer ist als das gelieferte. Bis September 2026 hat der Pull blind ersetzt. Eine noch nicht gesendete Änderung war dann weg, samt dem Hinweis, dass es sie je gab.

## Realtime ist nur eine Türglocke

Supabase Realtime schickt bei jeder Änderung in Postgres ein Event. Naheliegend wäre, die Payload direkt in SQLite zu schreiben. Das mache ich nicht. Ein Realtime-Event heißt in MoneyKoi nur „es hat sich etwas geändert“, und die App startet daraufhin denselben Delta-Sync wie immer.

So gibt es genau einen Code-Pfad, der Serverdaten in SQLite schreibt, mit denselben Regeln für Konflikte, Löschungen und Cursor. Ein paar Details braucht es trotzdem:

- **Entprellen.** Die Events aller Tabellen teilen sich ein Debounce von 250 ms mit höchstens 2 s Wartezeit. Eine Buchung mit ihren Tags ist ein Pull, nicht zwei, und ein Import, dessen Buchungen in kurzen Abständen eintreffen, hält die anderen Pulls nicht auf.
- **Echos ignorieren.** Events zu einer Zeile, die das Gerät gerade selbst gesendet hat, werden 4 s lang ignoriert.
- **Jeder Join zieht.** Realtime liefert nichts nach, was passiert ist, während die Verbindung weg war. Deshalb startet jedes Verbinden und Wiederverbinden des Kanals einen Pull. Im Hintergrund hält die App gar keinen Socket offen; beim Zurückkommen gibt es ohnehin einen Pull.

## Konflikte und Löschungen

Konflikte löst MoneyKoi mit Last-Writer-Wins auf `updated_at`, das ein Trigger bei jedem Schreiben setzt. Felder werden nicht zusammengeführt. Für ein Haushaltsbuch reicht mir das, weil selten zwei Geräte dieselbe Buchung ändern, bevor eines davon synchronisiert hat.

Gelöscht wird weich: Ein Delete setzt `deleted_at`, und die Zeile reist als normale Änderung mit dem nächsten Delta zu den anderen Geräten. Ein Trigger schreibt jede Änderung zusätzlich in eine Tabelle `sync_log`.

Hart gelöscht werden nur die Einträge der Einkaufsliste: Dort wird viel hinzugefügt und abgehakt, und niemand stellt einen Eintrag wieder her. Nach dem Löschen bleibt nur die `sync_log`-Zeile als Grabstein. Ein `BEFORE INSERT`-Trigger verweigert jede ID, die einen Grabstein hat. So gewinnt die Löschung auch gegen eine veraltete Offline-Änderung eines anderen Handys, die erst Stunden später ankommt.

## Grenzen

- **Last-Writer-Wins verliert gleichzeitige Änderungen.** Ändern zwei Geräte dieselbe Buchung, bevor eines davon synchronisiert hat, bleibt nur die, die zuletzt beim Server ankommt.
- **Ein Cursor kann eine spät committete Zeile überspringen.** `updated_at` ist der Start der schreibenden Transaktion, nicht ihr Ende. Läuft eine Transaktion noch, während eine später gestartete schon committet ist und ein Pull stattfindet, schiebt die spätere den Cursor an der früheren vorbei. Das braucht zwei überlappende Schreiber und einen Pull genau in diesem Fenster und ist selten. Die saubere Lösung wäre, den zurückgegebenen Cursor serverseitig ein paar Sekunden hinter `statement_timestamp()` zu halten. Die steht noch aus.
- **Echo-Unterdrückung nur nach ID.** Löscht ein anderes Gerät eine Zeile innerhalb von 4 s, nachdem dieses Gerät sie gesendet hat, kommt die Löschung erst mit dem nächsten Pull an statt live.
- **Es ist viel Code.** Outbox, Cursor, Realtime-Steuerung und App-Lebenszyklus sind ein eigenes Modul mit eigenen Tests. Für eine App, die ohnehin nur online genutzt wird, wäre das zu viel.

## Zum Mitnehmen

- Die lokale Datenbank ist die einzige Quelle der UI. Das Netzwerk läuft im Hintergrund.
- Der Client erzeugt die IDs, der Server setzt die Zeitstempel.
- Eine Outbox braucht Persistenz, einen Eintrag pro Datensatz und ein Pausieren statt endloser Wiederholungen.
- Realtime ist ein Auslöser, keine Datenquelle. Ein Weg für Serverdaten ist leichter zu verstehen und zu testen als zwei.
- Syncs werden mit `(updated_at, id)` paginiert, nie mit dem Zeitstempel allein.

---

MoneyKoi gibt es [als Android-App bei Google Play](https://play.google.com/store/apps/details?id=com.psyren.moneykoi). Mehr Infos auf [moneykoi.com](https://www.moneykoi.com).
