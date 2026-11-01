---
title: "Supabase RLS für Multi-Tenant-Apps: ein Header, zwei Regeln"
description: "Supabase RLS für Multi-Tenant-Apps: wie MoneyKoi das aktive Buch per Header und Pre-Request-Hook prüft und Lesen und Schreiben bewusst verschieden absichert."
date: 2026-10-31
slug: supabase-rls-multi-tenant
key: supabase-rls-multi-tenant
tags: [Supabase, PostgreSQL, Security]
keywords: [Supabase RLS Multi-Tenant, Supabase Row Level Security, Supabase Mandantenfähigkeit, PostgREST db_pre_request, Supabase Tenant Header]
cover: /images/blog/supabase-rls-multi-tenant/cover.de.webp
projects: [moneykoi]
---

In MoneyKoi ist ein Haushaltsbuch ein Mandant: Ein Haushalt teilt sich ein Buch, und eine Person kann in mehreren Büchern Mitglied sein. Für diese Multi-Tenant-Struktur nutze ich Supabase RLS (Row-Level-Security) mit einem Pre-Request-Hook: Vor jeder Anfrage prüft er den Header `X-Tenant-Id` gegen die Mitgliedschaften und merkt sich das aktive Buch. Gelesen wird dann nur im aktiven Buch, geschrieben gegen das Buch der jeweiligen Zeile. So bleiben Listen schnell, und offline gesammelte Buchungen gehen auch durch, wenn inzwischen ein anderes Buch offen ist.

## Ein Buch ist ein Mandant

Das Datenmodell ist schlicht. Es gibt `tenant` (das Buch), `profile` (die Person, global) und `tenant_member` mit einer Rolle: `owner`, `admin` oder `member`. Jede Datentabelle – Konten, Kategorien, Buchungen, Belege – hat eine Spalte `tenant_id`. Bei der Registrierung legt ein Trigger auf `auth.users` das Profil, ein persönliches Buch und die Owner-Mitgliedschaft an.

Eine Person kann bis zu drei eigene Bücher haben und per Link in weitere eingeladen werden ([zum Projekt](/projects/moneykoi)). Am Handy und im Browser wechselt man zwischen ihnen mit einem Tipp.

![Buchauswahl in MoneyKoi im Demo-Modus: ein privates Buch, ausgewählt, und ein geteiltes Buch, in dem die Person Owner ist](/images/blog/supabase-rls-multi-tenant/books.webp){width="320" height="711"}

## Warum die Tenant-ID nicht im JWT steht

Ein verbreiteter Weg in Supabase ist, die Tenant-ID als Claim ins JWT zu legen und in den Policies `auth.jwt()` zu lesen. Bei einem Mandanten pro Person passt das. Bei mehreren Büchern pro Person bräuchte jeder Wechsel ein neues Token, und das Token kennt immer nur ein Buch.

MoneyKoi legt beim Registrieren zwar das eigene Buch in `app_metadata` ab, aber welches Buch gerade offen ist, schickt der Client bei jedem Request als Header mit. Der Header ist ein Wunsch, kein Beweis. Ob er gilt, entscheidet der Server.

## Der Pre-Request-Hook

PostgREST kann vor jeder Anfrage eine Funktion ausführen. Registriert wird sie an der Rolle `authenticator`:

```sql
ALTER ROLE authenticator SET pgrst.db_pre_request TO 'public.db_pre_request';
NOTIFY pgrst, 'reload config';
```

Die Funktion ermittelt das Profil aus `auth.uid()`, liest den Header und prüft ihn gegen `tenant_member`. Ist der Header leer oder ist die Person nicht (mehr) Mitglied, fällt sie auf das zuletzt gewählte Buch zurück und danach auf das eigene. Gekürzt:

```sql
CREATE OR REPLACE FUNCTION public.db_pre_request()
  RETURNS void LANGUAGE plpgsql STABLE SECURITY DEFINER
  SET search_path = public
AS $$
DECLARE
  v_profile uuid;
  v_wanted  uuid;
  v_active  uuid;
BEGIN
  SELECT id INTO v_profile FROM public.profile WHERE user_id = auth.uid();

  BEGIN
    v_wanted := NULLIF(current_setting('request.headers', true)::json ->> 'x-tenant-id', '')::uuid;
  EXCEPTION WHEN others THEN
    v_wanted := NULL;  -- not a uuid
  END;

  -- Honour the header only for a live membership.
  SELECT tm.tenant_id INTO v_active
  FROM public.tenant_member tm
  WHERE tm.profile_id = v_profile AND tm.tenant_id = v_wanted AND tm.deleted_at IS NULL;

  -- Fallbacks omitted: the last chosen book, then the user's own.

  PERFORM set_config('request.tenant_id', COALESCE(v_active::text, ''), false);
  PERFORM set_config('request.profile_id', COALESCE(v_profile::text, ''), false);
END;
$$;
```

Drei Details daran:

- Ein ungültiger Header führt zu keinem Fehler, sondern zum Fallback. Die Antwort sagt damit auch nichts darüber, ob es das fremde Buch gibt.
- `set_config(…, false)` gilt für die ganze Sitzung, nicht nur für die Transaktion. Der Hook läuft vor jeder Anfrage und überschreibt die Werte, ein alter Wert bleibt also nicht stehen. Sauberer wäre `true`.
- Die echte Funktion setzt zusätzlich die Rolle im aktiven Buch (`request.role`).

Weil das Buch bei jedem Request mitkommt, stimmen Server und App auch dann überein, wenn der Wechsel offline passiert ist und der Server nie davon erfahren hat.

## Hilfsfunktionen in einem eigenen Schema

Die Policies lesen diese Werte über kleine Funktionen im Schema `internal`, das nicht über die API erreichbar ist:

```sql
CREATE FUNCTION internal.current_tenant() RETURNS uuid
  LANGUAGE sql STABLE SET search_path = ''
AS $$ SELECT NULLIF(current_setting('request.tenant_id', true), '')::uuid $$;

CREATE FUNCTION internal.is_member_of(p_tenant uuid) RETURNS boolean
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.tenant_member tm
    WHERE tm.tenant_id = p_tenant
      AND tm.profile_id = internal.current_profile()
      AND tm.deleted_at IS NULL)
$$;
```

`is_member_of` läuft als `SECURITY DEFINER`, damit die Abfrage auf `tenant_member` nicht selbst wieder durch die RLS dieser Tabelle muss. Das vermeidet Rekursion und spart Zeit. `SET search_path = ''` heißt, dass alles voll qualifiziert sein muss und kein anderes Schema eine gleichnamige Funktion unterschieben kann. Bei Funktionen, auf denen die ganze Mandantentrennung hängt, ist das Pflicht.

Die echte `current_tenant()` fällt nach `request.tenant_id` noch auf `app_metadata.tenant_id` im JWT zurück. Das wird bei Realtime wichtig.

## Supabase RLS asymmetrisch: Lesen im aktiven Buch, Schreiben im Buch der Zeile

Jetzt der Kern. Die Policies für Buchungen sahen zunächst so aus:

```sql
CREATE POLICY booking_select ON public.booking FOR SELECT
  USING (internal.is_current_tenant(tenant_id));

CREATE POLICY booking_insert ON public.booking FOR INSERT
  WITH CHECK (internal.can_write_booking(tenant_id));

CREATE POLICY booking_update ON public.booking FOR UPDATE
  USING (internal.can_write_booking(tenant_id))
  WITH CHECK (internal.can_write_booking(tenant_id));
```

`can_write_booking` prüft die Mitgliedschaft im Buch der Zeile, nicht im aktiven Buch. Warum zwei verschiedene Regeln?

- **Lesen eng.** Listen, Dashboards und Summen arbeiten immer in einem Buch. `tenant_id = <ein Wert>` passt direkt auf einen Index, und auch eine Abfrage ohne Filter liefert nur das offene Buch.
- **Schreiben gegen die Zeile.** Die App schreibt offline in eine Outbox ([wie die funktioniert](/blog/offline-first-flutter-supabase)). Wer im Buch B drei Buchungen erfasst, in Buch A wechselt und erst dann wieder Netz hat, hätte mit der Regel „nur im aktiven Buch“ drei abgelehnte Buchungen. Mit der Mitgliedschaftsregel gehen sie durch.

Dazu kommt die Rolle. Alltägliches – Buchungen, Belege, Tags, Einkaufsliste – darf jedes Mitglied schreiben. Die Struktur des Buchs – Konten, Kategorien, Sparziele, Regeln – nur Owner und Admin. Dafür gibt es eine zweite Funktion, `can_write`, die `role_in(tenant_id) IN ('owner', 'admin')` prüft.

Ganz ohne den passenden Header geht es trotzdem nicht. Postgres wendet bei `RETURNING` auch die SELECT-Policy auf die zurückgegebenen Zeilen an ([CREATE POLICY in der Postgres-Doku](https://www.postgresql.org/docs/current/sql-createpolicy.html)), und die App braucht die Zeile aus der Antwort, weil darin die Zeitstempel des Servers stehen. Deshalb trägt jedes Outbox-Element die ID seines Buchs und wird mit genau diesem Buch als `X-Tenant-Id` gesendet. Die Schreibregel entscheidet, ob geschrieben werden darf; der Header sorgt dafür, dass die Antwort lesbar ist.

## Realtime kennt keinen Header

Der Hook läuft vor jeder PostgREST-Anfrage, aber nicht für Realtime. Supabase prüft `postgres_changes`-Events gegen die SELECT-Policy, nur mit dem JWT des Abonnenten. Ohne `request.tenant_id` fiel `current_tenant()` auf `app_metadata.tenant_id` zurück, also immer auf das eigene Buch. Mitglieder eines geteilten Buchs bekamen deshalb keine Events dafür, und ihr Handy holte die Änderungen erst beim nächsten Pull. Aufgefallen ist mir das im Oktober 2026.

Die Lösung ist eine Funktion, die je nach Weg etwas anderes liefert:

```sql
CREATE FUNCTION internal.readable_tenant_ids() RETURNS uuid[]
  LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public, internal, pg_temp
AS $$
  SELECT CASE
    -- REST: the hook set an active book
    WHEN NULLIF(current_setting('request.tenant_id', true), '') IS NOT NULL
      THEN ARRAY[internal.current_tenant()]
    -- Realtime: every book the caller belongs to
    ELSE ARRAY(SELECT tm.tenant_id FROM public.tenant_member tm
               WHERE tm.profile_id = internal.current_profile()
                 AND tm.deleted_at IS NULL)
  END
$$;

CREATE POLICY booking_select ON public.booking FOR SELECT
  USING (tenant_id = ANY ((SELECT internal.readable_tenant_ids())::uuid[]));
```

Drei Details:

- Die Funktion steckt in `(SELECT …)`, damit Postgres sie einmal pro Statement auswertet statt einmal pro Zeile.
- Der Cast auf `uuid[]` ist keine Zierde. Ohne ihn ist `= ANY (SELECT …)` die Subquery-Form und vergleicht `uuid` mit `uuid[]`.
- Das Ergebnis ist ein Array, kein `OR`. Eine Variante mit `OR internal.is_member_of(tenant_id)` wäre kürzer, nimmt aber die Tenant-Bedingung aus dem Index. Jede REST-Abfrage ohne eigenen Tenant-Filter – im Web sind das die meisten – würde dann alle Bücher sequenziell lesen.

Der Preis dafür: Ein `ORDER BY` auf eine andere Spalte, etwa das Datum, kann nicht mehr geordnet über den Index `(tenant_id, date)` laufen und sortiert die Zeilen des Buchs stattdessen.

REST bleibt damit auf den Header beschränkt, Realtime sieht alle Bücher, in denen die Person Mitglied ist. Welches Buch die App gerade hört, legt sie beim Abonnieren mit dem Filter `tenant_id=eq.<aktives Buch>` fest.

## Grenzen

- **Die Policies teste ich manuell.** Für heikle Migrationen gibt es SQL-Skripte, die ich gegen die lokale Datenbank laufen lasse, aber keine automatischen RLS-Tests im CI.
- **Jede neue Tabelle braucht dieselbe Sorgfalt.** Eine Tabelle ohne RLS ist über die API offen. Die Regel im Projekt: keine Tabelle ohne Policies, und jede neue Realtime-Tabelle bekommt die Array-Policy, sonst hören Mitglieder geteilter Bücher nichts von ihr.

## Zum Mitnehmen

- Der aktive Mandant kommt als Request-Header und wird serverseitig gegen die Mitgliedschaft geprüft. Der Client wünscht, der Server entscheidet.
- Lesen auf den aktiven Mandanten beschränken, Schreiben gegen den Mandanten der Zeile prüfen, sobald Schreibvorgänge verspätet ankommen können.
- RLS-Hilfsfunktionen gehören in ein Schema außerhalb der API, mit `SET search_path = ''` und, wo nötig, `SECURITY DEFINER`.
- Realtime wertet Policies ohne Pre-Request-Hook aus. Jede Policy muss auch aus dieser Sicht stimmen.

---

MoneyKoi gibt es [als Android-App bei Google Play](https://play.google.com/store/apps/details?id=com.psyren.moneykoi). Mehr Infos auf [moneykoi.com](https://www.moneykoi.com).
