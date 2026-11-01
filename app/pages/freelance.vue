<template>
  <div class="pb-24 md:pb-32">
    <header class="mx-auto max-w-6xl px-6 pt-32 md:px-10 md:pt-40">
      <UiEyebrow class="block rise">
        {{ $t('nav.freelance') }}
      </UiEyebrow>
      <h1 class="rise rise-delay-1 mt-5 max-w-4xl font-display text-5xl leading-[1] tracking-tight text-ink md:text-7xl">
        {{ l(copy.title) }}
      </h1>
      <p class="rise rise-delay-2 measure mt-8 text-lg leading-relaxed text-ink-muted">
        {{ l(copy.intro) }}
      </p>
      <div class="rise rise-delay-3 mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
        <UiButtonLink
          to="/contact"
          variant="primary"
        >
          {{ $t('common.requestProject') }}
        </UiButtonLink>
        <UiButtonLink to="/projects">
          {{ $t('common.allProjects') }}
        </UiButtonLink>
      </div>
    </header>

    <!-- 01 Was ich übernehme -->
    <section class="mx-auto mt-24 max-w-6xl px-6 md:mt-32 md:px-10">
      <div
        v-reveal
        class="grid gap-10 md:grid-cols-12 md:gap-8"
      >
        <UiSectionHead
          :title="l(copy.offersTitle)"
          number="01"
          sticky
        />
        <ul class="border-t border-line md:col-span-8">
          <li
            v-for="offer in freelanceOffers"
            :key="offer.kicker.de"
            class="grid gap-2 border-b border-line py-6 sm:grid-cols-12 sm:gap-6"
          >
            <span class="eyebrow sm:col-span-3 sm:pt-1.5">{{ l(offer.kicker) }}</span>
            <div class="sm:col-span-9">
              <h3 class="text-lg font-semibold text-ink">
                {{ l(offer.title) }}
              </h3>
              <p class="measure mt-1.5 text-sm leading-relaxed text-ink-muted">
                {{ l(offer.text) }}
              </p>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- 02 Projekte als Beleg -->
    <section class="mx-auto mt-24 max-w-6xl px-6 md:mt-32 md:px-10">
      <div
        v-reveal
        class="grid gap-10 md:grid-cols-12 md:gap-8"
      >
        <UiSectionHead
          :title="l(copy.proofTitle)"
          number="02"
          sticky
        >
          {{ l(copy.proofIntro) }}
        </UiSectionHead>
        <ul class="border-t border-line md:col-span-8">
          <li
            v-for="p in caseStudies"
            :key="p.id"
            class="border-b border-line"
          >
            <NuxtLink
              :to="localePath(`/projects/${p.caseStudy.slug}`)"
              class="group flex items-baseline justify-between gap-6 py-6"
            >
              <span class="min-w-0">
                <span class="block font-display text-2xl leading-snug tracking-tight text-ink transition-colors duration-150 group-hover:text-accent">
                  {{ l(p.title) }}<template v-if="p.subtitle"> – <em class="italic">{{ l(p.subtitle) }}</em></template>
                </span>
                <span class="measure mt-2 block text-sm leading-relaxed text-ink-muted">
                  {{ l(p.summary ?? p.caseStudy.lede) }}
                </span>
              </span>
              <Icon
                class="shrink-0 self-center text-ink-faint transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-accent"
                name="lucide:arrow-right"
                size="16"
              />
            </NuxtLink>
          </li>
        </ul>
      </div>
    </section>

    <!-- 03 Technik -->
    <section class="mx-auto mt-24 max-w-6xl px-6 md:mt-32 md:px-10">
      <div
        v-reveal
        class="grid gap-10 md:grid-cols-12 md:gap-8"
      >
        <UiSectionHead
          :title="l(copy.stackTitle)"
          number="03"
          sticky
        />
        <ul class="grid border-t border-line md:col-span-8 md:grid-cols-2 md:gap-x-10">
          <li
            v-for="c in capabilities"
            :key="c.subtitle"
            class="border-b border-line py-7"
          >
            <UiEyebrow>{{ c.subtitle }}</UiEyebrow>
            <h3 class="mt-3 text-lg font-semibold text-ink">
              {{ l(c.title) }}
            </h3>
            <ul class="mt-3 space-y-1 text-sm leading-relaxed text-ink-muted">
              <li
                v-for="item in l(c.items)"
                :key="item"
              >
                {{ item }}
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </section>

    <!-- 04 Häufige Fragen. All answers stay in the HTML, closed or not. -->
    <section class="mx-auto mt-24 max-w-6xl px-6 md:mt-32 md:px-10">
      <div
        v-reveal
        class="grid gap-10 md:grid-cols-12 md:gap-8"
      >
        <UiSectionHead
          :title="l(copy.faqTitle)"
          number="04"
          sticky
        />
        <div class="border-t border-line md:col-span-8">
          <details
            v-for="item in faq"
            :key="item.q.de"
            class="group border-b border-line"
          >
            <summary class="flex cursor-pointer list-none items-baseline justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
              <h3 class="font-display text-xl leading-snug tracking-tight text-ink transition-colors duration-150 group-hover:text-accent md:text-2xl">
                {{ l(item.q) }}
              </h3>
              <Icon
                class="shrink-0 self-center text-ink-muted transition-transform duration-200 group-open:rotate-45"
                name="lucide:plus"
                size="16"
              />
            </summary>
            <p class="measure pb-7 text-base leading-relaxed text-ink-muted">
              {{ l(item.a) }}
            </p>
          </details>
        </div>
      </div>
    </section>

    <!-- Kontakt -->
    <section class="mx-auto mt-24 max-w-6xl px-6 md:mt-32 md:px-10">
      <div
        v-reveal
        class="border-t border-line pt-12"
      >
        <p class="font-display text-3xl leading-tight tracking-tight text-ink md:text-5xl">
          {{ l(copy.ctaTitle) }}
        </p>
        <div class="mt-8">
          <UiButtonLink
            to="/contact"
            variant="primary"
          >
            {{ $t('common.requestProject') }}
          </UiButtonLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { profile } from '~/data/profile'
import { caseStudies } from '~/data/projects'
import { capabilities, freelanceOffers } from '~/data/services'

const l = useLocalized()
const localePath = useLocalePath()

// Only what the rest of the site already says: no prices, availability or results.
const copy = {
  title: { de: 'Freelance Flutter-Entwickler aus Österreich.', en: 'Freelance Flutter developer from Austria.' },
  intro: {
    de: 'Apps und Web-Plattformen von der ersten Idee bis zum Store-Release: Ich bin Product Owner, UX-Designer und Full-Stack-Entwickler in einer Person. Neben meiner Arbeit an NeuraCharge übernehme ich ausgewählte Projekte – remote oder vor Ort in Oberösterreich, als eigenständiges Projekt oder als Verstärkung für ein bestehendes Team.',
    en: 'Apps and web platforms from the first idea to the store release: I\'m a product owner, UX designer and full-stack developer in one person. Alongside my work on NeuraCharge I take on selected projects – remote or on site in Upper Austria, as a standalone project or to strengthen an existing team.'
  },
  offersTitle: { de: 'Was ich übernehme', en: 'What I take on' },
  proofTitle: { de: 'Was ich schon gebaut habe', en: 'What I have built' },
  proofIntro: {
    de: 'Vier Produkte im Detail: was die Ausgangslage war, was meine Rolle war und welche Entscheidungen ich getroffen habe.',
    en: 'Four products in detail: where they started, what my role was and which decisions I made.'
  },
  stackTitle: { de: 'Womit ich arbeite', en: 'What I work with' },
  faqTitle: { de: 'Häufige Fragen', en: 'Common questions' },
  ctaTitle: { de: 'Projekt im Kopf? Schreib mir.', en: 'Got a project in mind? Write to me.' }
}

const faq = [
  {
    q: { de: 'Arbeitest du remote oder vor Ort?', en: 'Do you work remotely or on site?' },
    a: {
      de: 'Beides. Ich sitze in Garsten bei Steyr und arbeite remote oder vor Ort in Oberösterreich, etwa in Steyr oder Linz.',
      en: 'Both. I\'m based in Garsten near Steyr and work remotely or on site in Upper Austria, for example in Steyr or Linz.'
    }
  },
  {
    q: { de: 'Übernimmst du ganze Projekte oder verstärkst du ein Team?', en: 'Do you take on whole projects or join an existing team?' },
    a: {
      de: 'Beides: als eigenständiges Projekt von der Idee bis zum Release oder als Verstärkung für ein bestehendes Team.',
      en: 'Both: as a standalone project from idea to release, or to strengthen an existing team.'
    }
  },
  {
    q: { de: 'Welche Technik setzt du ein?', en: 'Which technology do you use?' },
    a: {
      de: 'Flutter für iOS und Android, Angular, Vue/Nuxt oder React im Web und Supabase, PostgreSQL oder Spring Boot im Backend. 3D mit Three.js kommt dazu, wenn ein Projekt es braucht.',
      en: 'Flutter for iOS and Android, Angular, Vue/Nuxt or React on the web, and Supabase, PostgreSQL or Spring Boot on the backend. 3D with Three.js comes in when a project needs it.'
    }
  },
  {
    q: { de: 'Übernimmst du auch Produkt und Design?', en: 'Do you also cover product and design?' },
    a: {
      de: 'Ja. Als Product Owner führe ich Roadmap und Backlog gemeinsam mit Kunden und Team, ich bin Certified Scrum Master und gestalte UX/UI und Prototypen für App, Portal und Website.',
      en: 'Yes. As product owner I run the roadmap and backlog together with customers and the team, I\'m a Certified Scrum Master, and I design the UX/UI and prototypes for app, portal and website.'
    }
  },
  {
    q: { de: 'Unterstützt du Projekte mit japanischen Partnern?', en: 'Can you support projects with Japanese partners?' },
    a: {
      de: 'Ja. Ich habe fünf Jahre in Japan gelebt, über vier davon als Entwickler in japanischen Firmen, und unterstütze Projekte mit japanischen Partnern oder Kunden – fachlich und auf Japanisch.',
      en: 'Yes. I lived in Japan for five years, more than four of them as a developer at Japanese companies, and I support projects with Japanese partners or customers – technically and in Japanese.'
    }
  },
  {
    q: { de: 'Wie starte ich ein Projekt mit dir?', en: 'How do I start a project with you?' },
    a: {
      de: `Schreib mir ein paar Zeilen an ${profile.email}. Ich melde mich fix.`,
      en: `Send me a few lines at ${profile.email}. I reply quickly.`
    }
  }
]

usePageSeo({
  title: { de: 'Freelance Flutter-Entwickler in Österreich', en: 'Freelance Flutter developer in Austria' },
  description: {
    de: 'Freelance Flutter-Entwickler und Product Owner aus Oberösterreich: Apps, Web-Portale und UX/UI von der Idee bis zum Release – remote oder vor Ort.',
    en: 'Freelance Flutter developer and product owner from Upper Austria: apps, web portals and UX/UI from idea to release – remote or on site.'
  },
  crumbs: [{ name: 'Freelance' }],
  schema: ({ url, personId }) => [
    {
      '@type': 'Service',
      '@id': `${url}#service`,
      'name': l(copy.title).replace(/\.$/, ''),
      'description': l(copy.intro),
      'serviceType': freelanceOffers.map(o => l(o.title)),
      'provider': { '@id': personId },
      'areaServed': ['Austria', 'Germany', 'Switzerland'].map(name => ({ '@type': 'Country', name })),
      'url': url
    },
    {
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      'mainEntity': faq.map(item => ({
        '@type': 'Question',
        'name': l(item.q),
        'acceptedAnswer': { '@type': 'Answer', 'text': l(item.a) }
      }))
    }
  ]
})
</script>
