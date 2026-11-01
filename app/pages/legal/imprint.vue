<template>
  <div class="pb-24 md:pb-32">
    <header class="mx-auto max-w-6xl px-6 pt-32 md:pt-40">
      <UiEyebrow class="block rise">
        {{ $t('footer.legal') }}
      </UiEyebrow>
      <h1 class="rise rise-delay-1 mt-5 font-display text-5xl leading-[1] tracking-tight text-ink md:text-7xl">
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
            Diensteanbieter
          </h2>
          <p class="mt-5">
            Ing. Gerald Gmainer<br>
            Money Koi<br>
            Am Platzl 3<br>
            4451 Garsten<br>
            Österreich
          </p>

          <p class="mt-4">
            E-Mail:
            <a
              class="text-ink underline decoration-line underline-offset-4 transition-colors duration-150 hover:decoration-accent"
              :href="`mailto:${profile.email}`"
            >
              {{ profile.email }}
            </a>
          </p>

          <p class="mt-4">
            Verantwortlich für den Inhalt dieser Website: Ing. Gerald Gmainer.
          </p>

          <p class="mt-8 text-sm text-ink-faint">
            Diese Website ist ein persönliches Portfolio zur Darstellung von Projekten und beruflichen Tätigkeiten
            im Bereich Softwareentwicklung, App, Web und 3D.<br>
            Stand: 1. November 2026
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
  title: { de: 'Impressum', en: 'Legal notice' },
  intro: { de: 'Angaben gemäß § 5 ECG.', en: 'Information pursuant to § 5 ECG (Austrian E-Commerce Act).' }
}

usePageSeo({
  title: copy.title,
  description: { de: 'Impressum von Gerald Gmainer, Garsten, Österreich – Angaben gemäß § 5 ECG.', en: 'Legal notice of Gerald Gmainer, Garsten, Austria – information pursuant to § 5 ECG.' },
  noindex: true
})
</script>
