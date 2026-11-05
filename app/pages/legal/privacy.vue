<template>
  <div class="pb-24 md:pb-32">
    <header class="mx-auto max-w-6xl px-6 pt-32 md:pt-40">
      <UiEyebrow class="block rise">
        {{ $t('footer.legal') }}
      </UiEyebrow>
      <h1 class="rise rise-delay-1 mt-5 font-display text-[2rem] leading-[1] tracking-tight text-ink sm:text-5xl md:text-7xl">
        {{ l(copy.title) }}
      </h1>
      <p class="rise rise-delay-2 measure mt-6 text-lg leading-relaxed text-ink-muted">
        {{ l(copy.intro) }}
      </p>
      <p
        v-if="locale !== 'de'"
        class="rise rise-delay-2 measure mt-3 text-sm text-ink-faint"
      >
        {{ $t('legal.germanOnly') }}
      </p>
    </header>

    <!-- The legal text itself is German only. -->
    <section
      class="mx-auto mt-16 max-w-6xl px-6 md:mt-20"
      lang="de"
    >
      <div class="measure space-y-12 text-base leading-relaxed text-ink-muted">
        <div class="border-t border-line pt-8">
          <h2 class="font-display text-2xl tracking-tight text-ink md:text-3xl">
            1. Verantwortlicher
          </h2>
          <p class="mt-5">
            Diensteanbieter und Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
          </p>
          <p class="mt-4">
            Ing. Gerald Gmainer<br>
            Am Platzl 3<br>
            4451 Garsten<br>
            Österreich
          </p>
          <p class="mt-4">
            E-Mail: <a
              class="text-ink underline decoration-line underline-offset-4 transition-colors duration-150 hover:decoration-accent"
              :href="`mailto:${profile.email}`"
            >{{ profile.email }}</a>
          </p>
          <p class="mt-4">
            Stand: 1. November 2026
          </p>
        </div>

        <div class="border-t border-line pt-8">
          <h2 class="font-display text-2xl tracking-tight text-ink md:text-3xl">
            2. Allgemeines zur Datenverarbeitung
          </h2>
          <p class="mt-5">
            Beim Besuch dieser Website werden personenbezogene Daten nur in dem Umfang verarbeitet, wie es für den
            Betrieb der Seite, die Auswertung anonymer Zugriffe und die Bereitstellung der Inhalte erforderlich ist.
            Es werden keine Cookies zu Werbe- oder Trackingzwecken gesetzt. Eine Weitergabe Ihrer Daten an Dritte erfolgt
            nur, soweit dies im Rahmen dieser Erklärung ausdrücklich beschrieben ist.
          </p>
          <p class="mt-4">
            Rechtsgrundlage für die Verarbeitung personenbezogener Daten ist Art. 6 Abs. 1 lit. f DSGVO
            (berechtigtes Interesse an der sicheren, stabilen Bereitstellung der Website) bzw. Art. 6 Abs. 1 lit. a DSGVO,
            soweit eine Verarbeitung auf Ihrer Einwilligung beruht (z.&nbsp;B. Vercel Analytics nach Opt-in).
          </p>
        </div>

        <div class="border-t border-line pt-8">
          <h2 class="font-display text-2xl tracking-tight text-ink md:text-3xl">
            3. Bereitstellung der Website und Server-Logfiles
          </h2>
          <p class="mt-5">
            Diese Website wird bei einem Dienstleister gehostet:
          </p>
          <p class="mt-4">
            Vercel Inc.<br>
            440 N Barranca Ave #4133<br>
            Covina, CA 91723<br>
            USA
          </p>
          <p class="mt-4">
            Die Server befinden sich nach Anbieterangaben in einem Rechenzentrum in Frankfurt am Main (Deutschland).
            Beim Aufruf der Website übermittelt Ihr Browser automatisch Daten, die in sogenannten Server-Logfiles
            gespeichert werden können. Dazu gehören insbesondere:
          </p>
          <ul class="mt-4 list-disc space-y-1 pl-5 marker:text-ink-faint">
            <li>IP-Adresse (gekürzt oder pseudonymisiert, soweit möglich)</li>
            <li>Datum und Uhrzeit des Zugriffs</li>
            <li>aufgerufene URL und übertragene Datenmenge</li>
            <li>Referrer-URL (die zuvor besuchte Seite, sofern übertragen)</li>
            <li>verwendeter Browser, Betriebssystem und Gerätetyp</li>
          </ul>
          <p class="mt-4">
            Diese Daten werden verarbeitet, um die Stabilität und Sicherheit des Betriebs zu gewährleisten
            (z.&nbsp;B. zur Fehleranalyse, Angriffserkennung). Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.
            Eine Zusammenführung dieser Daten mit anderen Datenquellen findet nicht statt. Die Logfiles werden vom
            Hosting-Anbieter in der Regel automatisiert nach einer kurzen Aufbewahrungsfrist gelöscht, sofern keine
            weitere Aufbewahrung zu Beweiszwecken erforderlich ist.
          </p>
        </div>

        <div class="border-t border-line pt-8">
          <h2 class="font-display text-2xl tracking-tight text-ink md:text-3xl">
            4. Vercel Analytics
          </h2>
          <p class="mt-5">
            Auf dieser Website wird der Dienst „Vercel Analytics“ des Hosting-Anbieters Vercel genutzt. Das Tool erfasst
            aggregierte Nutzungsdaten (z.&nbsp;B. Seitenaufrufe, ungefähre Region, Geräte- und Browserinformationen), um
            die Website technisch zu optimieren und Inhalte besser auszurichten. Es werden nach aktuellem Stand keine
            klassischen Tracking-Cookies gesetzt.
          </p>
          <p class="mt-4">
            Die Einbindung von Vercel Analytics erfolgt nur nach Ihrer ausdrücklichen Einwilligung über einen
            Opt-in-Dialog. Vor Ihrer Einwilligung werden keine Analysedaten erhoben.
            Rechtsgrundlage für diese Datenverarbeitung ist Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).
          </p>
          <p class="mt-4">
            Die Verarbeitung erfolgt durch Vercel als Auftragsverarbeiter. Dabei kann es in Einzelfällen zu einem
            Zugriff aus einem Drittland (USA) kommen. Vercel setzt hierfür nach eigenen Angaben geeignete
            Datenschutzgarantien (z.&nbsp;B. EU-Standardvertragsklauseln) ein.
          </p>
          <p class="mt-4">
            Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen: Über den Link
            „Nutzungsdaten-Einstellungen“ im Fußbereich jeder Seite öffnen Sie den Dialog erneut und können dort ablehnen.
          </p>
        </div>

        <div class="border-t border-line pt-8">
          <h2 class="font-display text-2xl tracking-tight text-ink md:text-3xl">
            5. Kontakt per E-Mail
          </h2>
          <p class="mt-5">
            Wenn Sie mich per E-Mail kontaktieren, werden die von Ihnen übermittelten Daten (z.&nbsp;B. Name, E-Mail-Adresse,
            Inhalt der Nachricht) zum Zweck der Bearbeitung Ihrer Anfrage verarbeitet.
          </p>
          <p class="mt-4">
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, sofern es sich um eine Anfrage im Rahmen (vor)vertraglicher
            Kommunikation handelt, oder Art. 6 Abs. 1 lit. f DSGVO aufgrund meines berechtigten Interesses an der
            Beantwortung von Anfragen. Die Daten werden nur so lange gespeichert, wie dies zur Bearbeitung Ihrer Anfrage
            erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen.
          </p>
        </div>

        <div class="border-t border-line pt-8">
          <h2 class="font-display text-2xl tracking-tight text-ink md:text-3xl">
            6. Externe Links
          </h2>
          <p class="mt-5">
            Diese Website enthält Links zu externen Websites Dritter (z.&nbsp;B. GitHub, LinkedIn, andere Projektseiten).
            Beim Anklicken eines solchen Links verlassen Sie diese Website. Für die Verarbeitung personenbezogener Daten
            auf den verlinkten Seiten sind ausschließlich die jeweiligen Betreiber verantwortlich. Ich habe keinen
            Einfluss auf die dortige Datenverarbeitung und empfehle, die jeweiligen Datenschutzerklärungen zu beachten.
          </p>
        </div>

        <div class="border-t border-line pt-8">
          <h2 class="font-display text-2xl tracking-tight text-ink md:text-3xl">
            7. Ihre Rechte
          </h2>
          <p class="mt-5">
            Ihnen stehen im Zusammenhang mit der Verarbeitung Ihrer personenbezogenen Daten folgende Rechte zu:
          </p>
          <ul class="mt-4 list-disc space-y-1 pl-5 marker:text-ink-faint">
            <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
            <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
            <li>Recht auf Löschung (Art. 17 DSGVO)</li>
            <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Recht auf Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
            <li>Recht, eine erteilte Einwilligung jederzeit zu widerrufen (Art. 7 Abs. 3 DSGVO)</li>
          </ul>
          <p class="mt-4">
            Zur Ausübung dieser Rechte können Sie sich jederzeit per E-Mail an
            <a
              class="text-ink underline decoration-line underline-offset-4 transition-colors duration-150 hover:decoration-accent"
              :href="`mailto:${profile.email}`"
            >{{ profile.email }}</a>
            wenden.
          </p>
          <p class="mt-4">
            Darüber hinaus haben Sie das Recht auf Beschwerde bei einer Aufsichtsbehörde, insbesondere in dem Mitgliedstaat
            Ihres gewöhnlichen Aufenthaltsortes, Ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes.
            In Österreich ist dies insbesondere:
          </p>
          <p class="mt-4">
            Österreichische Datenschutzbehörde<br>
            Barichgasse 40–42<br>
            1030 Wien<br>
            Österreich<br>
            Website: <a
              class="text-ink underline decoration-line underline-offset-4 transition-colors duration-150 hover:decoration-accent"
              href="https://www.dsb.gv.at"
              rel="noopener"
              target="_blank"
            >www.dsb.gv.at</a>
          </p>
        </div>

        <div class="border-t border-line pt-8">
          <h2 class="font-display text-2xl tracking-tight text-ink md:text-3xl">
            8. Änderungen dieser Datenschutzerklärung
          </h2>
          <p class="mt-5">
            Diese Datenschutzerklärung kann bei Bedarf angepasst werden, etwa wenn sich der Funktionsumfang der Website
            oder die zugrunde liegenden Rechtsgrundlagen ändern. Es gilt stets die auf dieser Seite veröffentlichte
            aktuelle Version.
          </p>
          <p class="mt-4">
            Stand dieser Datenschutzerklärung: 1. November 2026.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { profile } from '~/data/profile'

const l = useLocalized()
const { locale } = useI18n()

// Legal text is binding in German only; the header and a note are translated.
const copy = {
  title: { de: 'Datenschutzerklärung', en: 'Privacy policy' },
  intro: { de: 'Informationen zur Verarbeitung personenbezogener Daten auf dieser Website.', en: 'Information on how personal data is processed on this website.' }
}

usePageSeo({
  title: copy.title,
  description: { de: 'Datenschutzerklärung der Website von Gerald Gmainer: welche Daten verarbeitet werden, zu welchem Zweck und welche Rechte bestehen.', en: 'Privacy policy of Gerald Gmainer\'s website: which data is processed, for what purpose and which rights apply.' },
  noindex: true
})
</script>
