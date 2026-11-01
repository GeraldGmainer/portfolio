<template>
  <div class="pb-24 md:pb-32">
    <header class="mx-auto max-w-6xl px-6 pt-32 md:pt-40">
      <UiEyebrow class="block rise">
        {{ $t('nav.contact') }}
      </UiEyebrow>
      <h1 class="rise rise-delay-1 mt-5 font-display text-5xl leading-[1] tracking-tight text-ink md:text-7xl">
        {{ l(copy.title) }}
      </h1>
      <p class="rise rise-delay-2 measure mt-6 text-lg leading-relaxed text-ink-muted">
        {{ l(copy.intro) }}
      </p>
    </header>

    <!-- E-Mail as the hero element -->
    <section class="mx-auto mt-16 max-w-6xl px-6 md:mt-24">
      <a
        :href="`mailto:${profile.email}`"
        class="rise rise-delay-3 group inline-flex max-w-full items-center gap-x-3 font-display text-2xl leading-tight tracking-tight text-ink sm:text-3xl md:gap-x-5 md:text-5xl"
      >
        <span class="min-w-0 [overflow-wrap:anywhere] underline decoration-line decoration-1 underline-offset-8 transition-colors duration-200 group-hover:decoration-accent">
          {{ profile.email }}
        </span>
        <Icon
          name="lucide:arrow-up-right"
          class="shrink-0 text-ink-faint transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
          size="28"
        />
      </a>
    </section>

    <!-- Everything else as hairline rows -->
    <section class="mx-auto mt-16 max-w-6xl px-6 md:mt-24">
      <div class="grid md:grid-cols-12 md:gap-8">
        <ul class="border-t border-line md:col-span-8">
          <li class="grid grid-cols-[6.5rem_1fr] items-baseline gap-4 border-b border-line py-5 sm:grid-cols-[10rem_1fr]">
            <span class="eyebrow">{{ l(copy.name) }}</span>
            <span class="text-ink">{{ profile.honorificPrefix }} {{ profile.name }}</span>
          </li>
          <li
            v-for="row in links"
            :key="row.href"
            class="border-b border-line"
          >
            <a
              :href="row.href"
              :target="row.external ? '_blank' : undefined"
              :rel="row.external ? 'noopener' : undefined"
              class="group grid grid-cols-[6.5rem_1fr_auto] items-baseline gap-4 py-5 sm:grid-cols-[10rem_1fr_auto]"
            >
              <span class="eyebrow">{{ l(row.label) }}</span>
              <span class="min-w-0 text-ink">
                <span class="link-underline">{{ l(row.value) }}</span>
              </span>
              <Icon
                name="lucide:arrow-up-right"
                size="16"
                class="self-center text-ink-faint transition-all duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
              />
            </a>
          </li>
          <li class="grid grid-cols-[6.5rem_1fr] items-baseline gap-4 border-b border-line py-5 sm:grid-cols-[10rem_1fr]">
            <span class="eyebrow">{{ l(copy.location) }}</span>
            <span class="text-ink-muted">{{ l(copy.locationValue) }}</span>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { profile } from '~/data/profile'

const l = useLocalized()

usePageSeo({
  title: { de: 'Kontakt: Freelance-Projekt anfragen', en: 'Contact: start a freelance project' },
  description: {
    de: 'Kontakt zu Gerald Gmainer – Freelance-Projekte für Apps, Web-Portale, UX/UI und Product Ownership, remote oder vor Ort in Oberösterreich (Steyr, Linz).',
    en: 'Contact Gerald Gmainer – freelance projects for apps, web portals, UX/UI and product ownership, remote or on site in Upper Austria (Steyr, Linz).'
  },
  pageType: 'ContactPage',
  crumbs: [{ name: { de: 'Kontakt', en: 'Contact' } }]
})

const copy = {
  title: { de: 'Schreib mir.', en: 'Write to me.' },
  intro: {
    de: 'Ich melde mich fix. Offen für Freelance-Projekte: Produkt, App, Web und UX/UI – remote oder vor Ort in Oberösterreich.',
    en: 'I reply quickly. Open to freelance projects: product, app, web and UX/UI – remote or on site in Upper Austria.'
  },
  name: { de: 'Name', en: 'Name' },
  location: { de: 'Standort', en: 'Location' },
  locationValue: { de: 'Garsten bei Steyr · Remote/Hybrid', en: 'Garsten near Steyr, Austria · remote/hybrid' }
}

const links = [
  { label: { de: 'GitHub', en: 'GitHub' }, value: { de: 'GeraldGmainer', en: 'GeraldGmainer' }, href: 'https://github.com/GeraldGmainer', external: true },
  { label: { de: 'LinkedIn', en: 'LinkedIn' }, value: { de: 'gerald-gmainer', en: 'gerald-gmainer' }, href: 'https://www.linkedin.com/in/gerald-gmainer-7924552b1/', external: true },
  { label: { de: 'Lebenslauf (PDF)', en: 'Résumé (PDF, German)' }, value: { de: 'Öffnen', en: 'Open' }, href: '/downloads/Lebenslauf_Gmainer_public.pdf', external: true }
]
</script>
