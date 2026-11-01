<template>
  <div class="pb-24 md:pb-32">
    <header class="mx-auto max-w-6xl px-6 pt-32 md:pt-40">
      <UiEyebrow class="block rise">
        {{ $t('nav.about') }}
      </UiEyebrow>
      <h1 class="rise rise-delay-1 mt-5 font-display text-5xl leading-[1] tracking-tight text-ink md:text-7xl">
        <template v-if="locale === 'de'">
          Product Owner, Entwickler, <em>Holzwerker.</em>
        </template>
        <template v-else>
          Product owner, developer, <em>woodworker.</em>
        </template>
      </h1>
      <p class="rise rise-delay-2 measure mt-6 text-lg leading-relaxed text-ink-muted">
        {{ l(copy.intro) }}
      </p>
    </header>

    <!-- Portrait + meta -->
    <section class="mx-auto mt-16 max-w-6xl px-6 md:mt-24">
      <div class="grid gap-10 md:grid-cols-12 md:gap-8">
        <figure class="rise rise-delay-2 md:col-span-5">
          <img
            src="/images/profile.jpg"
            alt="Gerald Gmainer"
            width="1600"
            height="2000"
            class="aspect-[4/5] w-full rounded-md border border-line object-cover"
          >
        </figure>

        <div class="rise rise-delay-3 flex flex-col justify-between md:col-span-6 md:col-start-7">
          <dl class="border-t border-line">
            <div
              v-for="row in meta"
              :key="row.label.de"
              class="grid gap-1 border-b border-line py-4 sm:grid-cols-[7rem_1fr] sm:items-baseline sm:gap-4"
            >
              <dt class="eyebrow">
                {{ l(row.label) }}
              </dt>
              <dd class="font-mono text-sm text-ink">
                {{ l(row.value) }}
              </dd>
            </div>
          </dl>

          <div class="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <UiButtonLink
              to="/resume"
              variant="primary"
              icon="lucide:arrow-right"
            >
              {{ $t('nav.resume') }}
            </UiButtonLink>
            <UiButtonLink
              to="/projects"
              icon="lucide:arrow-right"
            >
              {{ $t('nav.projects') }}
            </UiButtonLink>
            <UiButtonLink
              to="/contact"
              icon="lucide:arrow-right"
            >
              {{ $t('nav.contact') }}
            </UiButtonLink>
          </div>
        </div>
      </div>
    </section>

    <!-- 01 Kurzprofil -->
    <section class="mx-auto mt-24 max-w-6xl px-6 md:mt-32">
      <div class="grid gap-10 md:grid-cols-12 md:gap-8">
        <UiSectionHead
          :title="l(copy.profileTitle)"
          number="01"
        />
        <ol
          v-reveal
          class="border-t border-line md:col-span-7 md:col-start-6"
        >
          <li
            v-for="(line, i) in l(profile)"
            :key="i"
            class="grid grid-cols-[2.5rem_1fr] gap-4 border-b border-line py-5"
          >
            <span class="pt-1 font-mono text-xs tabular-nums text-ink-faint">{{ num(i) }}</span>
            <p class="leading-relaxed text-ink-muted">
              {{ line }}
            </p>
          </li>
        </ol>
      </div>
    </section>

    <!-- 02 Abseits vom Bildschirm -->
    <section class="mx-auto mt-24 max-w-6xl px-6 md:mt-32">
      <div class="grid gap-10 md:grid-cols-12 md:gap-8">
        <UiSectionHead
          :title="l(copy.offTitle)"
          number="02"
        />
        <div
          v-reveal
          class="md:col-span-7 md:col-start-6"
        >
          <p class="measure leading-relaxed text-ink-muted">
            {{ l(copy.offWood) }}
          </p>
          <p class="measure mt-4 leading-relaxed text-ink-muted">
            {{ l(copy.offJapan) }}
          </p>

          <div class="mt-12 grid grid-cols-12 gap-6">
            <NuxtLink
              :to="localePath('/japan')"
              class="group col-span-12 sm:col-span-7"
            >
              <img
                :alt="l(copy.japanAlt)"
                src="/images/japan/amanohashidate.jpg"
                width="800"
                height="600"
                loading="lazy"
                class="aspect-[4/3] w-full rounded-md border border-line object-cover"
              >
              <span class="mt-3 block font-mono text-xs text-ink-muted transition-colors duration-150 group-hover:text-accent">
                {{ l(copy.japanLink) }} →
              </span>
            </NuxtLink>
            <NuxtLink
              :to="localePath('/woodworking')"
              class="group col-span-12 sm:col-span-5 sm:mt-16"
            >
              <img
                :alt="l(copy.horseAlt)"
                src="/images/pferd.webp"
                width="500"
                height="375"
                loading="lazy"
                class="aspect-[4/3] w-full rounded-md border border-line object-cover"
              >
              <span class="mt-3 block font-mono text-xs text-ink-muted transition-colors duration-150 group-hover:text-accent">
                {{ l(copy.woodLink) }} →
              </span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- 03 Skillset -->
    <section class="mx-auto mt-24 max-w-6xl px-6 md:mt-32">
      <div class="grid gap-10 md:grid-cols-12 md:gap-8">
        <UiSectionHead
          number="03"
          title="Skillset"
        >
          {{ l(copy.skillsIntro) }}
        </UiSectionHead>
        <div
          v-reveal
          class="border-t border-line md:col-span-8 md:col-start-5"
        >
          <div
            v-for="group in skillGroups"
            :key="group.label.de"
            class="grid gap-3 border-b border-line py-6 sm:grid-cols-12 sm:gap-6"
          >
            <h3 class="font-mono text-xs uppercase tracking-[0.14em] text-ink-faint sm:col-span-3 sm:pt-1">
              {{ l(group.label) }}
            </h3>
            <ul class="flex flex-wrap items-center gap-y-2 text-sm text-ink sm:col-span-9">
              <li
                v-for="(skill, i) in group.skills"
                :key="skill.icon + i"
                class="inline-flex items-center"
              >
                <Icon
                  :name="skill.icon"
                  size="14"
                  class="mr-1.5 shrink-0 text-ink-faint"
                />
                <span :class="skill.core ? 'text-ink' : 'text-ink-muted'">{{ skillLabel(skill) }}</span>
                <span
                  v-if="i < group.skills.length - 1"
                  aria-hidden="true"
                  class="mx-2.5 text-ink-faint"
                >·</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- 04 Tools -->
    <section class="mx-auto mt-24 max-w-6xl px-6 md:mt-32">
      <div class="grid gap-10 md:grid-cols-12 md:gap-8">
        <UiSectionHead
          number="04"
          title="Tools"
        >
          {{ l(copy.toolsIntro) }}
        </UiSectionHead>
        <ul
          v-reveal
          class="flex flex-wrap gap-y-2 border-t border-line pt-6 text-base text-ink-muted md:col-span-8 md:col-start-5"
        >
          <li
            v-for="(tool, i) in tools"
            :key="tool"
            class="flex items-center"
          >
            <span>{{ tool }}</span>
            <span
              v-if="i < tools.length - 1"
              aria-hidden="true"
              class="mx-2.5 text-ink-faint"
            >·</span>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { skillGroups, type Skill } from '~/data/skills'

const l = useLocalized()
const { locale } = useI18n()
const localePath = useLocalePath()

usePageSeo({
  title: { de: 'Über mich: Product Owner und Entwickler', en: 'About: product owner and developer' },
  description: {
    de: 'Gerald Gmainer: Product Owner, UX-Designer und Full-Stack-Entwickler aus Garsten bei Steyr. Fünf Jahre Japan, Certified Scrum Master, Flutter und Angular.',
    en: 'Gerald Gmainer: product owner, UX designer and full-stack developer from near Steyr, Austria. Five years in Japan, Certified Scrum Master, Flutter, Angular.'
  },
  pageType: 'ProfilePage',
  page: { mainEntity: { '@id': `${useRuntimeConfig().public.siteUrl}/#person` } },
  crumbs: [{ name: { de: 'Über mich', en: 'About' } }]
})

const num = (i: number) => String(i + 1).padStart(2, '0')
const skillLabel = (s: Skill) => (typeof s.label === 'string' ? s.label : l(s.label))

const copy = {
  intro: {
    de: 'Product Owner, UX-Designer und Full-Stack-Entwickler mit Schwerpunkt auf Flutter-Apps und Web-Plattformen. Ich entwickle robuste, nutzerzentrierte Produkte mit sauberer Architektur und Liebe zum Detail.',
    en: 'Product owner, UX designer and full-stack developer focused on Flutter apps and web platforms. I build robust, user-centred products with clean architecture and an eye for detail.'
  },
  profileTitle: { de: 'Kurzprofil', en: 'In short' },
  offTitle: { de: 'Abseits vom Bildschirm', en: 'Away from the screen' },
  offWood: {
    de: 'Wenn ich nicht vor dem Editor sitze, arbeite ich gern mit Holz: Aus einer kleinen Rassel für meinen Sohn wurden Möbel, Spielzeug und Alltagshelfer aus Massivholz.',
    en: 'When I\'m not in the editor, I like working with wood: a small rattle for my son turned into furniture, toys and everyday helpers in solid wood.'
  },
  offJapan: {
    de: 'Der Working-Holiday in Japan – quer durchs Land von Hokkaido bis Okinawa – gehört zu den prägendsten Erfahrungen, die ich gemacht habe.',
    en: 'The working holiday in Japan – across the country from Hokkaido to Okinawa – is one of the experiences that shaped me most.'
  },
  japanAlt: { de: 'Aussichtsplatz bei Amanohashidate', en: 'Viewpoint above Amanohashidate' },
  japanLink: { de: 'Japan-Aufenthalt', en: 'Time in Japan' },
  horseAlt: { de: 'Schaukelpferd aus Holz', en: 'Wooden rocking horse' },
  woodLink: { de: 'Holzarbeiten', en: 'Woodworking' },
  skillsIntro: {
    de: 'Hervorgehoben ist, womit ich täglich arbeite.',
    en: 'Highlighted is what I use every day.'
  },
  toolsIntro: { de: 'Werkzeuge, die meinen Alltag schneller machen', en: 'Tools that make my day faster' }
}

const meta = [
  { label: { de: 'Standort', en: 'Location' }, value: { de: 'Garsten bei Steyr · Remote/Hybrid', en: 'Garsten near Steyr, Austria · remote/hybrid' } },
  { label: { de: 'Sprachen', en: 'Languages' }, value: { de: 'Deutsch · Englisch · Japanisch', en: 'German · English · Japanese' } },
  { label: { de: 'Fokus', en: 'Focus' }, value: { de: 'Produkt · App · Web', en: 'Product · app · web' } },
  { label: { de: 'Japan', en: 'Japan' }, value: { de: '5 Jahre gelebt · über 4 Jahre in japanischen Firmen', en: '5 years lived · 4+ years at Japanese companies' } },
  { label: { de: 'Ausgleich', en: 'Off-screen' }, value: { de: 'Holzhandwerk', en: 'Woodworking' } },
  { label: { de: 'Freelance', en: 'Freelance' }, value: { de: 'Offen für Projekte · remote oder vor Ort', en: 'Open to projects · remote or on site' } }
]

const profile = {
  de: [
    'End-to-End von der Produktidee über UX/UI und Architektur bis zu Implementierung, Tests und Release.',
    'Als Product Owner: Roadmap, Backlog und Anforderungen gemeinsam mit Kunden und Team – Certified Scrum Master.',
    'Flutter-Apps mit lokaler Datenbank, konfliktarmem Sync und stabiler State-Architektur.',
    'Web-Plattformen mit TypeScript, klar strukturierten APIs und durchdachten Datenmodellen.',
    'Nutzerzentrierte Zusammenarbeit mit klarer Kommunikation, guten Tickets und hohem Ownership.'
  ],
  en: [
    'End to end, from the product idea through UX/UI and architecture to implementation, tests and release.',
    'As product owner: roadmap, backlog and requirements together with customers and the team – Certified Scrum Master.',
    'Flutter apps with a local database, low-conflict sync and a stable state architecture.',
    'Web platforms with TypeScript, clearly structured APIs and well-thought-out data models.',
    'User-centred collaboration with clear communication, good tickets and real ownership.'
  ]
}

const tools = [
  'Figma',
  'Jira',
  'Android Studio',
  'Xcode',
  'IntelliJ IDEA',
  'VS Code',
  'Supabase Studio',
  'Postman',
  'Docker Desktop',
  'Sentry',
  'Grafana',
  'Vercel'
]
</script>
