<template>
  <div>
    <!-- Hero: a phone workbench, running the real apps. -->
    <section
      id="home"
      class="relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      <!-- On phones the bench owns the first screen; the intro and CTAs follow below the fold. -->
      <div class="absolute inset-x-0 top-0 h-[100svh] md:bottom-0 md:h-auto">
        <DeskScene
          :hold="!deskDrawn"
          @progress="deskProgress = $event"
          @settled="deskLoading = false"
        />
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-navy-900 via-navy-900/70 to-transparent md:block"
        />
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-900 from-20% via-navy-900/70 via-40% to-transparent to-70% md:hidden"
        />
        <!-- The arc's back phones pass under the page header on phones; this keeps the logo and menu legible. -->
        <div
          aria-hidden="true"
          class="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-navy-900 from-40% via-navy-900/70 via-70% to-transparent md:hidden"
        />
        <Transition
          leave-active-class="transition-opacity duration-700 ease-out"
          leave-to-class="opacity-0"
        >
          <DeskLoader
            v-if="deskLoading"
            :progress="deskProgress"
            @drawn="deskDrawn = true"
          />
        </Transition>
      </div>

      <div class="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 pb-20 md:justify-center md:px-10 md:pb-32 md:pt-32">
        <div class="flex min-h-[100svh] flex-col justify-end pb-12 md:contents">
          <!-- Same three-line shape in both languages; only the words change. -->
          <h1
            data-desk-floor
            class="rise rise-delay-1 max-w-5xl font-display text-5xl leading-[0.98] tracking-tight text-ink sm:text-6xl lg:max-w-xl lg:text-7xl"
          >
            <template v-if="locale === 'de'">
              Produkt, Design<br class="hidden md:block"> <span class="whitespace-nowrap"><em class="italic">und</em> Code –</span><br class="hidden sm:block"> <span class="whitespace-nowrap">aus einer</span> Hand.
            </template>
            <template v-else>
              Product, design<br class="hidden md:block"> <span class="whitespace-nowrap"><em class="italic">and</em> code –</span><br class="hidden sm:block"> <span class="whitespace-nowrap">end to</span> end.
            </template>
          </h1>
        </div>
        <p
          data-desk-lede
          class="rise rise-delay-2 measure mt-4 text-lg leading-relaxed text-ink-muted md:mt-8 lg:max-w-xl"
        >
          {{ l(copy.heroText) }}
        </p>
        <div class="rise rise-delay-3 mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <UiButtonLink
            to="/projects"
            variant="primary"
          >
            {{ l(copy.heroCta) }}
          </UiButtonLink>
          <UiButtonLink to="/contact">
            {{ $t('nav.contact') }}
          </UiButtonLink>
        </div>
      </div>
    </section>

    <!-- 01 Projekte -->
    <section
      id="projects"
      class="border-t border-line py-24 md:py-32"
    >
      <div class="mx-auto max-w-6xl px-6 md:px-10">
        <div
          v-reveal
          class="grid gap-8 md:grid-cols-12 md:items-end"
        >
          <UiSectionHead
            :eyebrow="l(copy.projectsEyebrow)"
            :title="l(copy.projectsTitle)"
            number="01"
          />
          <p class="measure text-base leading-relaxed text-ink-muted md:col-span-6 md:col-start-7">
            {{ l(copy.projectsIntro) }}
          </p>
        </div>

        <ol class="mt-16 md:mt-20">
          <li
            v-for="(project, index) in featuredProjects"
            :key="project.id"
            v-reveal
            class="grid gap-8 border-t border-line py-10 md:grid-cols-12 md:items-center md:gap-10 md:py-14"
          >
            <!-- No frame: the transparent device shot floats on a glow in the project's brand colour. -->
            <div
              :class="index % 2 === 0 ? 'md:order-2' : 'md:order-1'"
              :style="{ '--glow': project.glow }"
              class="glow-stage flex justify-center py-4 md:col-span-7 md:py-6"
            >
              <img
                v-if="project.mockup"
                :alt="`${l(project.title)} – ${l(project.subtitle!)}`"
                :class="project.mockupKind === 'phone' ? 'w-[56%] max-w-60' : 'w-full'"
                :height="project.mockupKind === 'phone' ? 1200 : 1274"
                :src="project.mockup"
                :width="project.mockupKind === 'phone' ? 569 : 1800"
                class="relative drop-shadow-[0_30px_40px_rgb(0_0_0/0.45)]"
                loading="lazy"
              >
              <img
                v-else
                :alt="`${l(project.title)} – ${l(project.subtitle!)}`"
                :src="project.image"
                class="relative w-full rounded-lg border border-line"
                height="602"
                loading="lazy"
                width="800"
              >
            </div>

            <div
              :class="index % 2 === 0 ? 'md:order-1' : 'md:order-2'"
              class="md:col-span-5"
            >
              <p class="font-mono text-xs text-ink-faint">
                <span class="tabular-nums">{{ String(index + 1).padStart(2, '0') }}</span>
                <span class="mx-2">—</span>{{ companyOf(project) }}
              </p>
              <h3 class="mt-4 font-display text-2xl tracking-tight text-ink md:text-3xl">
                {{ l(project.title) }}
                <span class="mt-1 block text-xl italic text-ink-muted">{{ l(project.subtitle!) }}</span>
              </h3>
              <p class="measure mt-4 text-base leading-relaxed text-ink-muted">
                {{ l(project.summary ?? project.description) }}
              </p>
              <div class="mt-6 flex flex-wrap gap-2">
                <UiTag
                  v-for="tag in project.stack.slice(0, 4)"
                  :key="tag"
                >
                  {{ tag }}
                </UiTag>
              </div>
              <div class="mt-8 flex flex-wrap gap-x-6 gap-y-2">
                <UiButtonLink
                  :to="`/projects/${project.caseStudy!.slug}`"
                  icon="lucide:arrow-right"
                >
                  {{ $t('common.caseStudy') }}
                </UiButtonLink>
                <UiButtonLink
                  v-if="project.website"
                  :to="project.website"
                >
                  {{ $t('common.website') }}
                </UiButtonLink>
              </div>
            </div>
          </li>
        </ol>

        <div
          v-reveal
          class="mt-12 border-t border-line pt-8"
        >
          <UiButtonLink to="/projects">
            {{ $t('common.allProjects') }}
          </UiButtonLink>
        </div>
      </div>
    </section>

    <!-- 02 Was ich mache -->
    <section
      id="capabilities"
      class="border-t border-line py-24 md:py-32"
    >
      <div class="mx-auto max-w-6xl px-6 md:px-10">
        <div
          v-reveal
          class="grid gap-12 md:grid-cols-12 md:gap-8"
        >
          <UiSectionHead
            :eyebrow="l(copy.capEyebrow)"
            :title="l(copy.capTitle)"
            number="02"
            sticky
          >
            {{ l(copy.capIntro) }}
          </UiSectionHead>

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
      </div>
    </section>

    <!-- 03 Stack -->
    <section
      id="stack"
      class="border-t border-line py-24 md:py-32"
    >
      <div class="mx-auto max-w-6xl px-6 md:px-10">
        <div
          v-reveal
          class="grid gap-12 md:grid-cols-12 md:gap-8"
        >
          <UiSectionHead
            :title="l(copy.stackTitle)"
            eyebrow="Stack"
            number="03"
            sticky
          >
            {{ l(copy.stackIntro) }}
          </UiSectionHead>

          <dl class="border-t border-line md:col-span-8">
            <div
              v-for="group in skillGroups"
              :key="group.label.de"
              class="grid gap-3 border-b border-line py-7 sm:grid-cols-[9rem_1fr] sm:gap-8"
            >
              <dt class="pt-1 font-mono text-xs uppercase tracking-[0.14em] text-ink-faint">
                {{ l(group.label) }}
              </dt>
              <dd class="text-base leading-relaxed">
                <template
                  v-for="(skill, i) in group.skills"
                  :key="skill.icon + i"
                >
                  <span :class="skill.core ? 'text-ink' : 'text-ink-muted'">{{ skillLabel(skill) }}</span><span
                    v-if="i < group.skills.length - 1"
                    aria-hidden="true"
                    class="text-ink-faint"
                  >{{ ' \u00b7 ' }}</span>
                </template>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>

    <!-- 04 Freelance -->
    <section
      id="freelance"
      class="border-t border-line py-24 md:py-32"
    >
      <div class="mx-auto max-w-6xl px-6 md:px-10">
        <div
          v-reveal
          class="grid gap-10 md:grid-cols-12 md:gap-8"
        >
          <UiSectionHead
            eyebrow="Freelance"
            number="04"
            sticky
          >
            <template #title>
              <template v-if="locale === 'de'">
                Offen für <em class="italic">Freelance</em>-Projekte.
              </template>
              <template v-else>
                Open to <em class="italic">freelance</em> projects.
              </template>
            </template>
            {{ l(copy.freelanceIntro) }}
          </UiSectionHead>

          <div class="md:col-span-8">
            <ul class="border-t border-line">
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
            <div class="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <UiButtonLink
                to="/contact"
                variant="primary"
              >
                {{ $t('common.requestProject') }}
              </UiButtonLink>
              <UiButtonLink to="/freelance">
                {{ l(copy.freelanceMore) }}
              </UiButtonLink>
              <UiButtonLink to="/projects">
                {{ l(copy.pastWork) }}
              </UiButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 05 Abseits vom Bildschirm -->
    <section
      id="offscreen"
      class="border-t border-line py-24 md:py-32"
    >
      <div class="mx-auto max-w-6xl px-6 md:px-10">
        <div
          v-reveal
          class="grid gap-14 md:grid-cols-12 md:items-center md:gap-8"
        >
          <div class="md:col-span-5">
            <div class="flex items-baseline gap-4">
              <span class="font-mono text-xs tabular-nums text-accent">05</span>
              <UiEyebrow>{{ l(copy.offEyebrow) }}</UiEyebrow>
            </div>
            <h2 class="mt-3 font-display text-4xl leading-[1.05] tracking-tight text-ink md:text-5xl">
              <template v-if="locale === 'de'">
                Werkbank, Wanderwege <em class="italic">und</em> Japan.
              </template>
              <template v-else>
                Workbench, trails <em class="italic">and</em> Japan.
              </template>
            </h2>
            <p class="measure mt-6 text-base leading-relaxed text-ink-muted">
              {{ l(copy.offWood) }}
            </p>
            <p class="measure mt-4 text-base leading-relaxed text-ink-muted">
              {{ l(copy.offJapan) }}
            </p>
            <div class="mt-8 flex flex-wrap gap-x-8 gap-y-3">
              <UiButtonLink to="/japan">
                {{ l(copy.offJapanLink) }}
              </UiButtonLink>
              <UiButtonLink to="/woodworking">
                {{ l(copy.offWoodLink) }}
              </UiButtonLink>
            </div>
          </div>

          <div class="md:col-span-6 md:col-start-7">
            <figure class="ml-auto w-[84%]">
              <figcaption class="mb-2 text-right font-mono text-[11px] text-ink-faint">
                {{ l(copy.hikeCaption) }}
              </figcaption>
              <img
                :alt="l(copy.hikeAlt)"
                class="w-full rounded-md border border-line"
                height="600"
                loading="lazy"
                width="800"
                src="/images/japan/hike.jpg"
              >
            </figure>
            <figure class="relative -mt-10 w-[56%] md:-mt-16">
              <div class="rounded-md bg-navy-900 p-1.5">
                <img
                  :alt="l(copy.horseAlt)"
                  class="w-full rounded border border-line"
                  height="375"
                  loading="lazy"
                  width="500"
                  src="/images/pferd.webp"
                >
              </div>
              <figcaption class="mt-1 pl-1.5 font-mono text-[11px] text-ink-faint">
                {{ l(copy.horseCaption) }}
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>

    <!-- 06 Kontakt -->
    <section
      id="contact"
      class="border-t border-line py-24 md:py-32"
    >
      <div class="mx-auto max-w-6xl px-6 md:px-10">
        <div
          v-reveal
          class="grid gap-10 md:grid-cols-12 md:items-end"
        >
          <div class="md:col-span-9">
            <div class="flex items-baseline gap-4">
              <span class="font-mono text-xs tabular-nums text-accent">06</span>
              <UiEyebrow>{{ $t('nav.contact') }}</UiEyebrow>
            </div>
            <h2 class="mt-4 font-display text-4xl leading-[1.02] tracking-tight text-ink sm:text-5xl md:text-6xl">
              <template v-if="locale === 'de'">
                Projekt im Kopf? <em class="italic">Schreib mir.</em>
              </template>
              <template v-else>
                Got a project in mind? <em class="italic">Write to me.</em>
              </template>
            </h2>
            <a
              class="link-underline mt-8 inline-block break-all font-display text-2xl tracking-tight text-ink transition-colors duration-150 hover:text-accent sm:text-3xl md:text-4xl"
              :href="`mailto:${profile.email}`"
            >{{ profile.email }}</a>
          </div>
          <div class="md:col-span-3 md:pb-2 md:text-right">
            <UiButtonLink to="/contact">
              {{ l(copy.allContact) }}
            </UiButtonLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { profile } from '~/data/profile'
import { FEATURED, projectById, type Project } from '~/data/projects'
import { capabilities, freelanceOffers } from '~/data/services'
import { skillGroups, type Skill } from '~/data/skills'

const l = useLocalized()
const { locale } = useI18n()

const deskLoading = ref(true)
const deskProgress = ref(0)
// The scene's first frame waits for DeskLoader to close its trace.
const deskDrawn = ref(false)

usePageSeo({
  title: null,
  ogTitle: {
    // Short enough that Google doesn't cut it; the place lives in the description.
    de: 'Gerald Gmainer – Flutter-Entwickler & Product Owner',
    en: 'Gerald Gmainer – Flutter developer & product owner'
  },
  description: {
    de: 'Product Owner, UX-Designer und Entwickler aus dem Raum Steyr, OÖ. Flutter-Apps und Web-Portale von der Idee bis zum Release – offen für Freelance-Projekte.',
    en: 'Product owner, UX designer and developer near Steyr, Austria. Flutter apps and web platforms from first idea to release – open to freelance projects.'
  }
})

const copy = {
  heroText: {
    de: 'Ich bin Gerald Gmainer: Product Owner, UX-Designer und Full-Stack-Entwickler in einer Person. Ich bringe Apps und Web-Plattformen von der ersten Idee bis zum Store-Release – mit Flutter, Angular, Supabase und allem, was das Projekt sonst noch braucht.',
    en: 'I\'m Gerald Gmainer: product owner, UX designer and full-stack developer in one person. I take apps and web platforms from the first idea to the store release – with Flutter, Angular, Supabase and whatever else the project calls for.'
  },
  heroCta: { de: 'Projekte ansehen', en: 'See projects' },
  projectsEyebrow: { de: 'Ausgewählte Arbeit', en: 'Selected work' },
  projectsTitle: { de: 'Projekte, die ich gern zeige', en: 'Projects I like to show' },
  projectsIntro: {
    de: 'Vier Produkte aus App und Web – vom eigenen Haushaltsbuch bis zur Plattform für Ladestationen, die ich gerade als Product Owner verantworte. Alle vier zeige ich im Detail.',
    en: 'Four products across app and web – from my own budget book to the EV charging platform I currently lead as product owner. All four are covered in detail.'
  },
  capEyebrow: { de: 'Was ich mache', en: 'What I do' },
  capTitle: { de: 'Was ich in Projekte einbringe', en: 'What I bring to a project' },
  capIntro: {
    de: 'Produktdenken, Design und Umsetzung in einer Person: Ich kläre, was gebaut werden soll, gestalte es und baue es – bis es im Store und im Browser läuft.',
    en: 'Product thinking, design and engineering in one person: I work out what should be built, design it and build it – until it runs in the store and in the browser.'
  },
  stackTitle: { de: 'Womit ich arbeite', en: 'What I work with' },
  stackIntro: {
    de: 'Schwerpunkt auf App, Web und Backend. Hervorgehoben ist, womit ich täglich arbeite; 3D mit Three.js und Unity kommt dazu, wenn ein Projekt es braucht.',
    en: 'Focused on app, web and backend. Highlighted is what I use every day; 3D with Three.js and Unity comes in when a project needs it.'
  },
  freelanceIntro: {
    de: 'Neben meiner Arbeit an NeuraCharge übernehme ich ausgewählte Projekte – remote oder vor Ort in Oberösterreich, als eigenständiges Projekt oder als Verstärkung für ein bestehendes Team.',
    en: 'Alongside my work on NeuraCharge I take on selected projects – remote or on site in Upper Austria, as a standalone project or to strengthen an existing team.'
  },
  freelanceMore: { de: 'Mehr zur Zusammenarbeit', en: 'More on working together' },
  pastWork: { de: 'Bisherige Arbeiten', en: 'Past work' },
  offEyebrow: { de: 'Abseits vom Bildschirm', en: 'Away from the screen' },
  offWood: {
    de: 'Wenn ich nicht vor dem Editor sitze, arbeite ich gern mit Holz: Aus einer kleinen Rassel für meinen Sohn wurden Möbel, Spielzeug und Alltagshelfer aus Massivholz.',
    en: 'When I\'m not in the editor, I like working with wood: a small rattle for my son turned into furniture, toys and everyday helpers in solid wood.'
  },
  offJapan: {
    de: 'Der Working-Holiday in Japan – quer durchs Land von Hokkaido bis Okinawa – gehört zu den prägendsten Erfahrungen, die ich gemacht habe.',
    en: 'The working holiday in Japan – across the country from Hokkaido to Okinawa – is one of the experiences that shaped me most.'
  },
  offJapanLink: { de: 'Japan-Aufenthalt', en: 'Time in Japan' },
  offWoodLink: { de: 'Holzarbeiten', en: 'Woodworking' },
  hikeCaption: { de: '21 Tage zu Fuß durch Hokkaido', en: '21 days on foot across Hokkaido' },
  hikeAlt: { de: 'Unterwegs auf der 21-tägigen Fernwanderung durch Hokkaido', en: 'On the 21-day long-distance hike across Hokkaido' },
  horseAlt: { de: 'Selbst gebautes Schaukelpferd aus Massivholz', en: 'Home-made rocking horse in solid wood' },
  horseCaption: { de: 'Schaukelpferd, Massivholz', en: 'Rocking horse, solid wood' },
  allContact: { de: 'Alle Kontaktwege', en: 'All ways to reach me' }
}

const featuredProjects = FEATURED.map(id => projectById(id)!) satisfies Project[]

const companyOf = (p: Project) => (typeof p.company === 'string' ? p.company : l(p.company))
const skillLabel = (s: Skill) => (typeof s.label === 'string' ? s.label : l(s.label))
</script>
