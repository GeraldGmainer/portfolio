<template>
  <div class="min-h-screen">
    <header class="mx-auto max-w-6xl px-6 pt-32 md:pt-40">
      <div class="grid gap-8 md:grid-cols-12 md:items-end">
        <div class="md:col-span-6">
          <div class="rise">
            <UiEyebrow>{{ l(copy.eyebrow) }}</UiEyebrow>
          </div>
          <h1 class="rise rise-delay-1 mt-5 font-display text-5xl leading-[1] tracking-tight text-ink md:text-7xl">
            {{ l(copy.title) }}
          </h1>
        </div>

        <div class="md:col-span-6 md:col-start-7">
          <p class="rise rise-delay-2 measure text-base leading-relaxed text-ink-muted md:text-lg">
            {{ l(copy.intro) }}
          </p>
          <dl class="rise rise-delay-3 mt-5 flex gap-8">
            <div
              v-for="s in stats"
              :key="s.label.de"
              class="flex flex-row-reverse items-baseline gap-2"
            >
              <dt class="eyebrow">
                {{ l(s.label) }}
              </dt>
              <dd class="font-display text-2xl tabular-nums tracking-tight text-ink">
                {{ s.value }}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </header>

    <!-- Featured: text on top, then web app and phone on a wide stage. The window runs off the bottom edge. -->
    <section class="mx-auto max-w-6xl px-6 pt-12 md:pt-16">
      <article
        v-reveal
        :style="{ '--glow': spotlight.glow }"
        class="group relative overflow-hidden rounded-xl border border-line bg-navy-800"
      >
        <div
          aria-hidden="true"
          class="spotlight-glow pointer-events-none absolute inset-0"
        />

        <div class="relative grid gap-6 p-7 md:grid-cols-12 md:gap-8 md:p-12 md:pb-10">
          <div class="md:col-span-5">
            <p class="eyebrow">
              {{ l(copy.featured) }} · {{ l(spotlight.caseStudy!.period!) }}
            </p>
            <h2 class="mt-4 font-display text-5xl leading-none tracking-tight text-ink md:text-6xl">
              {{ l(spotlight.title) }}
            </h2>
            <p class="mt-3 font-display text-xl italic text-ink-muted">
              {{ l(spotlight.subtitle!) }} · {{ companyOf(spotlight) }}
            </p>
            <div class="mt-6 hidden flex-wrap gap-x-6 gap-y-2 md:flex">
              <UiButtonLink
                v-for="link in linksOf(spotlight)"
                :key="link.to"
                :icon="link.icon"
                :to="link.to"
              >
                {{ link.label }}
              </UiButtonLink>
            </div>
          </div>

          <div class="md:col-span-6 md:col-start-7">
            <p class="text-base leading-relaxed text-ink-muted">
              {{ l(spotlight.summary ?? spotlight.description) }}
            </p>
            <div class="mt-5 flex flex-wrap gap-1.5">
              <UiTag
                v-for="tag in spotlight.stack"
                :key="tag"
              >
                {{ tag }}
              </UiTag>
            </div>
            <div class="mt-6 flex flex-wrap gap-x-6 gap-y-2 md:hidden">
              <UiButtonLink
                v-for="link in linksOf(spotlight)"
                :key="link.to"
                :icon="link.icon"
                :to="link.to"
              >
                {{ link.label }}
              </UiButtonLink>
            </div>
          </div>
        </div>

        <button
          :aria-label="`${l(spotlight.title)} – ${l(copy.enlarge)}`"
          class="group/zoom relative block aspect-[8/7] w-full cursor-zoom-in overflow-hidden md:aspect-[2/1]"
          type="button"
          @click="openLightbox(spotlight, spotlight.webShot!)"
        >
          <span class="browser absolute left-[5%] top-[4%] block w-[132%] md:left-12 md:top-2 md:w-[80%]">
            <span
              aria-hidden="true"
              class="browser-bar"
            >
              <i /><i /><i />
            </span>
            <img
              :alt="l(copy.webShotAlt)"
              :src="spotlight.webShot"
              class="block w-full"
              decoding="async"
              fetchpriority="high"
              height="1285"
              width="1651"
            >
          </span>
          <img
            :alt="l(copy.phoneShotAlt)"
            :src="spotlight.mockup"
            class="absolute right-[5%] top-[6%] h-[90%] w-auto drop-shadow-[0_24px_32px_rgb(0_0_0/0.55)] md:right-12 md:top-0 md:h-[96%]"
            decoding="async"
            height="1554"
            width="737"
          >
          <span class="zoom-hint">
            <Icon
              name="lucide:maximize-2"
              size="14"
            />
          </span>
        </button>
      </article>
    </section>

    <!-- 01 Highlights: two equal columns. Every card has the same stage, so rows line up. -->
    <section class="mx-auto max-w-6xl px-6 pt-24 md:pt-32">
      <div
        v-reveal
        class="grid gap-8 md:grid-cols-12 md:items-end"
      >
        <UiSectionHead
          :eyebrow="l(copy.highlightsEyebrow)"
          number="01"
          :title="l(copy.highlightsTitle)"
        />
        <p class="measure text-base leading-relaxed text-ink-muted md:col-span-6 md:col-start-7">
          {{ l(copy.highlightsIntro) }}
        </p>
      </div>

      <div class="mt-12 grid gap-x-10 gap-y-16 md:mt-16 md:grid-cols-2 md:gap-y-20">
        <article
          v-for="(project, i) in highlights"
          :key="project.id"
          v-reveal
          class="group flex flex-col"
        >
          <button
            :aria-label="`${l(project.title)} – ${l(copy.enlarge)}`"
            :class="{ 'glow-stage': project.mockup }"
            :style="{ '--glow': project.glow }"
            class="group/zoom relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-xl border border-line bg-navy-800 transition-colors duration-300 group-hover:border-line-strong"
            type="button"
            @click="openLightbox(project, project.image)"
          >
            <img
              v-if="project.mockup"
              :alt="l(project.title)"
              :src="project.mockup"
              class="absolute left-[5%] top-[5%] size-[90%] object-contain drop-shadow-[0_24px_32px_rgb(0_0_0/0.45)] transition-transform duration-700 ease-out-soft group-hover:scale-[1.03]"
              decoding="async"
              loading="lazy"
            >
            <img
              v-else
              :alt="l(project.title)"
              :src="project.image"
              class="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.03]"
              decoding="async"
              height="900"
              loading="lazy"
              width="1200"
            >
            <span class="zoom-hint">
              <Icon
                name="lucide:maximize-2"
                size="14"
              />
            </span>
          </button>
          <p class="mt-6 font-mono text-xs tabular-nums text-ink-faint">
            <span class="text-accent">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="mx-2">—</span>{{ fmt(project.date) }} · {{ companyOf(project) }}
          </p>
          <h3 class="mt-3 font-display text-2xl leading-tight tracking-tight text-ink md:text-3xl">
            {{ l(project.title) }}
          </h3>
          <p class="measure mt-3 text-sm leading-relaxed text-ink-muted md:text-base">
            {{ l(project.summary ?? project.description) }}
          </p>
          <div class="mt-5 flex flex-wrap gap-1.5">
            <UiTag
              v-for="tag in project.stack"
              :key="tag"
            >
              {{ tag }}
            </UiTag>
          </div>
          <div
            v-if="linksOf(project).length"
            class="mt-auto flex flex-wrap gap-x-6 gap-y-2 pt-6"
          >
            <UiButtonLink
              v-for="link in linksOf(project)"
              :key="link.to"
              :icon="link.icon"
              :to="link.to"
            >
              {{ link.label }}
            </UiButtonLink>
          </div>
        </article>
      </div>
    </section>

    <!-- 02 Archiv: everything, grouped by year, expandable rows -->
    <section class="mx-auto max-w-6xl px-6 pb-24 pt-24 md:pb-32 md:pt-36">
      <div
        v-reveal
        class="grid gap-8 md:grid-cols-12 md:items-end"
      >
        <UiSectionHead
          :eyebrow="l(copy.archiveEyebrow)"
          number="02"
          :title="l(copy.archiveTitle)"
        />
        <p class="measure text-base leading-relaxed text-ink-muted md:col-span-6 md:col-start-7">
          {{ l(copy.archiveIntro) }}
        </p>
      </div>

      <div class="relative mt-14 md:mt-16">
        <span
          aria-hidden="true"
          class="absolute inset-x-0 bottom-0 h-px bg-line"
        />
        <div
          :aria-label="l(copy.filter)"
          class="flex gap-6 overflow-x-auto scrollbar-hide sm:gap-8"
          role="tablist"
        >
          <button
            v-for="tab in filterTabs"
            :key="tab.key"
            :aria-selected="activeFilter === tab.key"
            :class="activeFilter === tab.key
              ? 'border-accent text-ink'
              : 'border-transparent hover:text-ink-muted'"
            class="eyebrow relative flex shrink-0 cursor-pointer items-baseline gap-2 whitespace-nowrap border-b pb-3 transition-colors duration-150"
            role="tab"
            type="button"
            @click="activeFilter = tab.key"
          >
            {{ l(tab.label) }}
            <span class="hidden tabular-nums text-ink-faint sm:inline">{{ counts[tab.key] }}</span>
          </button>
        </div>
      </div>

      <Transition
        mode="out-in"
        name="fade"
      >
        <div
          :key="activeFilter"
          @mousemove="onListMove"
        >
          <div
            v-for="group in groups"
            :key="group.year"
            class="grid border-b border-line md:grid-cols-12"
          >
            <div class="pt-6 md:col-span-2 md:pb-6">
              <span class="block font-display text-3xl tabular-nums tracking-tight text-ink-faint md:sticky md:top-28">
                {{ group.year }}
              </span>
            </div>

            <ul class="md:col-span-10">
              <li
                v-for="project in group.items"
                :key="project.id"
                class="border-t border-line first:border-t-0"
              >
                <button
                  :aria-expanded="openId === project.id"
                  class="group grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 py-5 text-left md:grid-cols-[minmax(0,1fr)_15rem_auto]"
                  type="button"
                  @click="toggle(project)"
                  @mouseenter="onRowEnter(project, $event)"
                  @mouseleave="hovered = null"
                >
                  <span class="min-w-0">
                    <span class="block font-display text-xl leading-snug tracking-tight text-ink transition-colors duration-150 group-hover:text-accent md:text-2xl">
                      {{ l(project.title) }}
                    </span>
                    <span class="mt-1 block font-mono text-xs text-ink-faint">
                      {{ month(project.date) }} · {{ companyOf(project) }}
                    </span>
                  </span>
                  <span class="hidden truncate font-mono text-[11px] tracking-wide text-ink-muted md:block">
                    {{ project.stack.slice(0, 3).join(' · ') }}
                  </span>
                  <span
                    :class="openId === project.id ? 'rotate-45 border-line-strong text-ink' : 'text-ink-muted'"
                    class="grid size-8 place-items-center rounded-full border border-line transition duration-300 group-hover:border-line-strong group-hover:text-ink"
                  >
                    <Icon
                      name="lucide:plus"
                      size="14"
                    />
                  </span>
                </button>

                <div
                  :class="openId === project.id ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
                  :inert="openId !== project.id"
                  class="grid transition-[grid-template-rows,opacity] duration-300 ease-out-soft"
                >
                  <div class="min-h-0 overflow-hidden">
                    <div class="grid gap-6 pb-8 md:grid-cols-10 md:gap-8">
                      <button
                        :aria-label="`${l(project.title)} – ${l(copy.enlarge)}`"
                        :class="project.mockup ? 'glow-stage aspect-square md:aspect-[4/3]' : 'overflow-hidden rounded-md border border-line bg-navy-800'"
                        :style="{ '--glow': project.glow }"
                        class="group/zoom relative block cursor-zoom-in self-start md:col-span-4"
                        type="button"
                        @click="openLightbox(project, project.image)"
                      >
                        <template v-if="opened.has(project.id)">
                          <img
                            v-if="project.mockup"
                            :alt="l(project.title)"
                            :src="project.mockup"
                            class="absolute left-[5%] top-[5%] size-[90%] object-contain drop-shadow-[0_16px_24px_rgb(0_0_0/0.45)]"
                            decoding="async"
                          >
                          <img
                            v-else
                            :alt="l(project.title)"
                            :src="project.image"
                            class="aspect-[4/3] w-full object-cover"
                            decoding="async"
                            height="900"
                            width="1200"
                          >
                        </template>
                        <span class="zoom-hint">
                          <Icon
                            name="lucide:maximize-2"
                            size="14"
                          />
                        </span>
                      </button>
                      <div class="md:col-span-6">
                        <p class="whitespace-pre-line text-sm leading-relaxed text-ink-muted md:text-base">
                          {{ l(project.description) }}
                        </p>
                        <div class="mt-5 flex flex-wrap gap-1.5">
                          <UiTag
                            v-for="tag in project.stack"
                            :key="tag"
                          >
                            {{ tag }}
                          </UiTag>
                        </div>
                        <div
                          v-if="linksOf(project).length"
                          class="mt-6 flex flex-wrap gap-x-6 gap-y-2"
                        >
                          <UiButtonLink
                            v-for="link in linksOf(project)"
                            :key="link.to"
                            :icon="link.icon"
                            :to="link.to"
                          >
                            {{ link.label }}
                          </UiButtonLink>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </Transition>
    </section>

    <!-- Desktop only: image preview that trails the cursor over the archive. -->
    <div
      v-if="canHover"
      ref="previewEl"
      aria-hidden="true"
      class="pointer-events-none fixed left-0 top-0 z-30 w-72"
    >
      <div
        :class="previewVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'"
        class="overflow-hidden rounded-md border border-line-strong bg-navy-800 shadow-2xl shadow-black/50 transition duration-200 ease-out-soft"
      >
        <img
          v-if="previewSrc"
          :src="previewSrc"
          alt=""
          class="aspect-[4/3] w-full object-cover"
        >
      </div>
    </div>

    <PhotoLightbox
      v-model:index="lightboxIndex"
      :items="lightboxItems"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import type { LightboxItem } from '~/components/PhotoLightbox.vue'
import { caseStudies, projects, type Project } from '~/data/projects'

const l = useLocalized()
const { t, locale } = useI18n()
const localePath = useLocalePath()

const copy = {
  eyebrow: { de: 'Projekte', en: 'Projects' },
  title: { de: 'Alle Projekte', en: 'All projects' },
  intro: {
    de: 'Mein eigenes Produkt, sechs weitere Highlights und das komplette Archiv – von der ersten Android-App bis heute.',
    en: 'My own product, six more highlights and the complete archive – from my first Android app to today.'
  },
  featured: { de: 'Im Fokus', en: 'Featured' },
  webShotAlt: { de: 'MoneyKoi Web-App: Dashboard mit Bilanz, Geldfluss und Prognose', en: 'MoneyKoi web app: dashboard with balance, cash flow and forecast' },
  phoneShotAlt: { de: 'MoneyKoi Android-App: Startbildschirm', en: 'MoneyKoi Android app: home screen' },
  enlarge: { de: 'Bild vergrößern', en: 'enlarge image' },
  highlightsEyebrow: { de: 'Auswahl', en: 'Selection' },
  highlightsTitle: { de: 'Highlights', en: 'Highlights' },
  highlightsIntro: {
    de: 'Von der Plattform für Ladestationen bis zum Trainings-Simulator mit echten Maschinenteilen – Apps, Web, 3D und Simulation.',
    en: 'From an EV charging platform to a training simulator driven by real machine parts – apps, web, 3D and simulation.'
  },
  archiveEyebrow: { de: 'Archiv', en: 'Archive' },
  archiveTitle: { de: 'Alles, chronologisch', en: 'Everything, by date' },
  archiveIntro: {
    de: 'Inklusive älterer Projekte, Freelance- und Hobby-Arbeiten. Ein Klick auf ein Projekt zeigt Details, Bild und Links.',
    en: 'Including older projects, freelance and side projects. Click a project for details, an image and links.'
  },
  filter: { de: 'Projekte filtern', en: 'Filter projects' }
}

usePageSeo({
  title: { de: 'Projekte: Flutter-Apps, Web-Portale und 3D', en: 'Projects: Flutter apps, web platforms and 3D' },
  description: {
    de: 'Projekte von Gerald Gmainer: Flutter-Apps, Web-Portale und 3D – vier davon im Detail: MoneyKoi, NeuraCharge, D-Drive und Rodelbahn-Diagnose.',
    en: 'Projects by Gerald Gmainer: Flutter apps, web portals and 3D – four of them in detail: MoneyKoi, NeuraCharge, D-Drive and alpine coaster diagnostics.'
  },
  pageType: 'CollectionPage',
  page: {
    mainEntity: {
      '@type': 'ItemList',
      'itemListElement': caseStudies.map((p, i) => ({
        '@type': 'ListItem',
        'position': i + 1,
        'name': l(p.title),
        'url': `${useRuntimeConfig().public.siteUrl}${localePath(`/projects/${p.caseStudy.slug}`)}`
      }))
    }
  },
  crumbs: [{ name: { de: 'Projekte', en: 'Projects' } }]
})

const spotlightId = 'moneykoi'

const highlightIds = [
  'neuracharge',
  'rodelbahn',
  'raraya',
  'd-drive',
  'tamping-game',
  'tamping-sim'
]

const sorted = [...projects].sort((a, b) => +new Date(b.date) - +new Date(a.date))

const spotlight = projects.find(p => p.id === spotlightId)!
const highlights = sorted.filter(p => highlightIds.includes(p.id))

const projectYears = projects.map(p => new Date(p.date).getFullYear())
const stats = [
  { label: { de: 'Projekte', en: 'Projects' }, value: projects.length },
  { label: { de: 'Jahre', en: 'Years' }, value: Math.max(...projectYears) - Math.min(...projectYears) }
]

const companyOf = (p: Project) => (typeof p.company === 'string' ? p.company : l(p.company))

const filterTabs = [
  { key: 'alle', label: { de: 'Alle', en: 'All' } },
  { key: 'beruf', label: { de: 'Beruf', en: 'Work' } },
  { key: 'hobby', label: { de: 'Eigene & Freelance', en: 'Own & freelance' } }
] as const

type FilterKey = (typeof filterTabs)[number]['key']

const route = useRoute()
const router = useRouter()

const isFilterKey = (v: unknown): v is FilterKey => filterTabs.some(t => t.key === v)

// Filter is deep-linkable: /projects?tab=beruf. The page is prerendered without
// a query, so the tab can only apply after hydration.
const activeFilter = ref<FilterKey>('alle')

const byFilter: Record<FilterKey, (p: Project) => boolean> = {
  alle: () => true,
  beruf: p => p.type === 'work',
  hobby: p => p.type === 'own' || p.type === 'freelance'
}

const counts = {
  alle: projects.length,
  beruf: projects.filter(byFilter.beruf).length,
  hobby: projects.filter(byFilter.hobby).length
}

// Archive rows grouped by year, newest first.
const groups = computed(() => {
  const byYear = new Map<number, Project[]>()
  for (const p of sorted.filter(byFilter[activeFilter.value])) {
    const year = new Date(p.date).getFullYear()
    byYear.set(year, [...(byYear.get(year) ?? []), p])
  }
  return [...byYear].map(([year, items]) => ({ year, items }))
})

// One archive row open at a time. Images mount on first open so the
// collapsed rows do not load every screenshot up front.
const openId = ref<string | null>(null)
const opened = reactive(new Set<string>())

function toggle(p: Project) {
  openId.value = openId.value === p.id ? null : p.id
  opened.add(p.id)
}

// Cursor-trailing preview for the archive (fine pointers only).
const PREVIEW_W = 288
const canHover = ref(false)
const hovered = ref<Project | null>(null)
const previewSrc = ref('')
const previewEl = ref<HTMLElement | null>(null)
const previewVisible = computed(() => !!hovered.value && hovered.value.id !== openId.value)

const target = { x: 0, y: 0 }
const pos = { x: 0, y: 0 }
let frame = 0
let reducedMotion = false

function aim(e: MouseEvent) {
  const right = e.clientX + 32
  target.x = right + PREVIEW_W > window.innerWidth - 16 ? e.clientX - 32 - PREVIEW_W : right
  target.y = e.clientY - PREVIEW_W * 0.375
}

function render() {
  const k = reducedMotion ? 1 : 0.2
  pos.x += (target.x - pos.x) * k
  pos.y += (target.y - pos.y) * k
  if (previewEl.value) previewEl.value.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
  frame = Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) > 0.5 ? requestAnimationFrame(render) : 0
}

function onRowEnter(p: Project, e: MouseEvent) {
  if (!canHover.value) return
  aim(e)
  // Appear at the cursor instead of gliding in from the last spot.
  if (!hovered.value) Object.assign(pos, target)
  hovered.value = p
  previewSrc.value = p.image
  if (!frame) frame = requestAnimationFrame(render)
}

function onListMove(e: MouseEvent) {
  if (!hovered.value) return
  aim(e)
  if (!frame) frame = requestAnimationFrame(render)
}

watch(activeFilter, (tab) => {
  openId.value = null
  hovered.value = null
  router.replace({ query: tab === 'alle' ? {} : { tab } })
})

onMounted(() => {
  if (isFilterKey(route.query.tab)) activeFilter.value = route.query.tab
  canHover.value = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
})

onBeforeUnmount(() => cancelAnimationFrame(frame))

// Cards stay readable by cropping instead of shrinking; the lightbox shows
// the clicked image full size, then any extra shots (e.g. the whole phone).
const lightboxItems = ref<LightboxItem[]>([])
const lightboxIndex = ref<number | null>(null)

function openLightbox(p: Project, src: string) {
  lightboxItems.value = [...new Set([src, ...(p.gallery ?? [])])].map(s => ({
    src: s,
    title: l(p.title),
    eyebrow: `${fmt(p.date)} · ${companyOf(p)}`
  }))
  lightboxIndex.value = 0
}

// Case study first: it is the page that explains the project.
function linksOf(p: Project) {
  return [
    p.caseStudy && { label: t('common.caseStudy'), to: `/projects/${p.caseStudy.slug}`, icon: 'lucide:arrow-right' },
    p.website && { label: t('common.website'), to: p.website },
    p.playstore && { label: t('common.android'), to: p.playstore },
    p.github && { label: t('common.github'), to: p.github }
  ].filter(link => !!link)
}

const dateLocale = computed(() => (locale.value === 'de' ? 'de-AT' : 'en-GB'))

function fmt(d: string) {
  return new Date(d).toLocaleDateString(dateLocale.value, { year: 'numeric', month: 'short' })
}

function month(d: string) {
  return new Date(d).toLocaleDateString(dateLocale.value, { month: 'short' })
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Lit from behind the phone in the project's brand colour. */
.spotlight-glow {
  background:
    radial-gradient(50% 60% at 78% 70%, color-mix(in oklab, var(--glow) 22%, transparent), transparent 70%),
    radial-gradient(40% 50% at 0% 100%, color-mix(in oklab, var(--glow) 8%, transparent), transparent 70%);
}

/* The web app is dark like the card, so the window needs an edge of its own. */
.browser {
  overflow: hidden;
  border: 1px solid var(--color-line-strong);
  border-bottom: 0;
  border-radius: 0.625rem 0.625rem 0 0;
  background: #0f1214;
  box-shadow: 0 24px 60px rgb(0 0 0 / 0.5);
}

.browser-bar {
  display: flex;
  gap: 0.375rem;
  padding: 0.625rem 0.75rem;
  border-bottom: 1px solid var(--color-line);
}

.browser-bar i {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background: var(--color-line-strong);
}

/* Small "enlarge" badge in the corner of clickable images. */
.zoom-hint {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  border: 1px solid var(--color-line-strong);
  background: color-mix(in oklab, var(--color-navy-950) 75%, transparent);
  color: var(--color-ink);
  opacity: 0;
  backdrop-filter: blur(6px);
  transition: opacity 0.2s var(--ease-out-soft);
}

.group\/zoom:hover .zoom-hint,
.group\/zoom:focus-visible .zoom-hint {
  opacity: 1;
}

@media (hover: none) {
  .zoom-hint {
    opacity: 1;
  }
}
</style>
