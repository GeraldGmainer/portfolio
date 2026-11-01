<template>
  <div class="pb-24 md:pb-32">
    <header class="mx-auto max-w-6xl px-6 pt-32 md:pt-40">
      <UiEyebrow class="block rise">
        Japan
      </UiEyebrow>
      <h1 class="rise rise-delay-1 mt-5 font-display text-5xl leading-[1] tracking-tight text-ink md:text-7xl">
        <template v-if="locale === 'de'">
          Fünf Jahre <em>Japan.</em>
        </template>
        <template v-else>
          Five years of <em>Japan.</em>
        </template>
      </h1>
      <p class="rise rise-delay-2 measure mt-6 text-lg leading-relaxed text-ink-muted">
        {{ l(copy.intro) }}
      </p>
    </header>

    <!-- 01 Reise durch ganz Japan -->
    <section class="mx-auto mt-20 max-w-6xl px-6 md:mt-28">
      <div class="grid gap-10 md:grid-cols-12 md:gap-8">
        <UiSectionHead
          :title="l(copy.travelTitle)"
          number="01"
        />
        <div
          v-reveal
          class="md:col-span-7 md:col-start-6"
        >
          <p class="measure leading-relaxed text-ink-muted">
            {{ l(copy.travel1) }}
          </p>
          <p class="measure mt-4 leading-relaxed text-ink-muted">
            {{ l(copy.travel2) }}
          </p>
        </div>
      </div>

      <JapanMap
        id="karte"
        ref="japanMap"
        v-reveal
        class="mt-14 scroll-mt-28 md:mt-20"
      />
    </section>

    <!-- 02 Reise-Highlights -->
    <section class="mx-auto mt-24 max-w-6xl px-6 md:mt-32">
      <div class="grid gap-10 md:grid-cols-12 md:gap-8">
        <UiSectionHead
          :title="l(copy.tripsTitle)"
          number="02"
        >
          {{ l(copy.tripsIntro) }}
        </UiSectionHead>
      </div>

      <div
        v-reveal
        class="mt-14 grid gap-x-8 gap-y-14 md:mt-20 md:grid-cols-12"
      >
        <article
          v-for="(trip, i) in trips"
          :key="trip.images[0]"
          :class="tripLayout[i]?.cols"
        >
          <button
            type="button"
            class="group relative block w-full overflow-hidden rounded-md border border-line"
            :aria-label="$t('common.viewPhotos', { name: l(trip.title) })"
            @click="openPhoto(trip.images[0]!)"
          >
            <img
              :src="trip.images[0]"
              :alt="l(trip.title)"
              width="800"
              height="600"
              loading="lazy"
              :class="tripLayout[i]?.ratio"
              class="w-full object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.03]"
            >
            <span class="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-navy-950/75 text-ink opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
              <Icon
                name="lucide:expand"
                :size="15"
              />
            </span>
            <span
              v-if="trip.images.length > 1"
              class="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded bg-navy-950/75 px-2 py-1 font-mono text-[11px] tabular-nums text-ink"
            >
              <Icon
                name="lucide:images"
                :size="13"
              />
              {{ trip.images.length }}
            </span>
          </button>
          <p class="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
            {{ pick(trip.region) }}
          </p>
          <h3 class="mt-1.5 font-semibold text-ink">
            {{ l(trip.title) }}
          </h3>
          <p class="mt-2 text-sm leading-relaxed text-ink-muted">
            {{ l(trip.description) }}
          </p>
          <div class="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
            <p class="font-mono text-xs text-ink-faint">
              {{ l(trip.tags).join(' · ') }}
            </p>
            <button
              v-if="trip.map"
              type="button"
              class="group inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted transition-colors hover:text-accent"
              @click="showOnMap(trip.map)"
            >
              <Icon
                name="lucide:map-pin"
                :size="13"
              />
              <span class="link-underline">{{ $t('common.onMap') }}</span>
            </button>
          </div>
        </article>
      </div>
    </section>

    <!-- 03 Besondere Momente -->
    <section class="mx-auto mt-24 max-w-6xl px-6 md:mt-32">
      <div class="grid gap-10 md:grid-cols-12 md:gap-8">
        <UiSectionHead
          :title="l(copy.momentsTitle)"
          number="03"
        >
          {{ l(copy.momentsIntro) }}
        </UiSectionHead>
      </div>

      <div
        v-reveal
        class="mt-14 md:mt-20"
      >
        <div
          ref="strip"
          class="scrollbar-hide -mx-6 flex snap-x snap-mandatory scroll-px-6 gap-5 overflow-x-auto px-6 md:gap-8"
          @scroll.passive="onStripScroll"
        >
          <article
            v-for="(m, i) in moments"
            :key="m.image"
            class="w-[85%] shrink-0 snap-start sm:w-[68%] lg:w-[58%]"
          >
            <button
              type="button"
              class="group relative block w-full overflow-hidden rounded-md border border-line"
              :aria-label="$t('common.viewPhoto', { name: l(m.title) })"
              @click="openPhoto(m.image)"
            >
              <img
                :src="m.image"
                :alt="l(m.title)"
                width="800"
                height="600"
                loading="lazy"
                class="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.03]"
              >
              <span class="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-navy-950/75 text-ink opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                <Icon
                  name="lucide:expand"
                  :size="15"
                />
              </span>
            </button>
            <div class="mt-4 flex items-baseline gap-3">
              <span class="font-mono text-xs tabular-nums text-accent">{{ num(i) }}</span>
              <UiEyebrow>{{ l(m.location) }}</UiEyebrow>
            </div>
            <h3 class="mt-1.5 font-semibold text-ink">
              {{ l(m.title) }}
            </h3>
            <p class="measure mt-2 text-sm leading-relaxed text-ink-muted">
              {{ l(m.description) }}
            </p>
            <button
              v-if="m.place"
              type="button"
              class="group mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted transition-colors hover:text-accent"
              @click="showOnMap({ place: m.place })"
            >
              <Icon
                name="lucide:map-pin"
                :size="13"
              />
              <span class="link-underline">{{ $t('common.onMap') }}</span>
            </button>
          </article>
        </div>

        <div class="mt-10 flex items-center gap-5">
          <span class="font-mono text-xs tabular-nums text-ink-faint">
            {{ num(stripIndex) }} / {{ num(moments.length - 1) }}
          </span>
          <div class="relative h-px flex-1 bg-line">
            <span
              class="absolute inset-y-0 left-0 bg-ink transition-[width] duration-300 ease-out-soft"
              :style="{ width: `${((stripIndex + 1) / moments.length) * 100}%` }"
            />
          </div>
          <div class="flex gap-2">
            <button
              v-for="dir in [-1, 1]"
              :key="dir"
              type="button"
              :aria-label="dir < 0 ? l(copy.prevMoment) : l(copy.nextMoment)"
              :disabled="dir < 0 ? stripIndex === 0 : stripIndex === moments.length - 1"
              class="grid h-10 w-10 place-items-center rounded-full border border-line text-ink-muted transition-colors hover:border-line-strong hover:text-ink disabled:pointer-events-none disabled:opacity-30"
              @click="stepStrip(dir)"
            >
              <Icon
                :name="dir < 0 ? 'lucide:arrow-left' : 'lucide:arrow-right'"
                :size="16"
              />
            </button>
          </div>
        </div>
      </div>
    </section>

    <PhotoLightbox
      v-model:index="photoIndex"
      :items="photos"
    />
  </div>
</template>

<script lang="ts" setup>
import { moments, trips, type MapTarget } from '~/data/japan-highlights'
import type { RegionId } from '~/data/japan-map'
import type { LightboxItem } from '~/components/PhotoLightbox.vue'
import type { Localized } from '#shared/types/localized'

const l = useLocalized()
const { locale } = useI18n()

usePageSeo({
  title: { de: 'Fünf Jahre Japan: Arbeit, Reisen und Hokkaido', en: 'Five years in Japan: work, travel and Hokkaido' },
  description: {
    de: 'Fünf Jahre Japan: Working Holiday, Arbeit bei japanischen Firmen und Reisen von Hokkaido bis Okinawa – mit interaktiver Karte aller Orte.',
    en: 'Five years in Japan: a working holiday, work at Japanese companies and travel from Hokkaido to Okinawa – with an interactive map of every place.'
  },
  crumbs: [{ name: 'Japan' }]
})

const copy = {
  intro: {
    de: 'Zwischen Großstadt und Natur: Arbeiten, reisen und unterwegs wie Einheimische leben. Von Hokkaido bis Okinawa – zu Fuß, per Auto, Motorrad und mit viel Neugier.',
    en: 'Between big city and nature: working, travelling and living like a local. From Hokkaido to Okinawa – on foot, by car, by motorbike and with plenty of curiosity.'
  },
  travelTitle: { de: 'Reise durch ganz Japan', en: 'Across all of Japan' },
  travel1: {
    de: 'Meine erste Japanreise im Jahr 2017 hat mich so begeistert, dass ich unbedingt zurückkehren wollte. Als ich später vom Working-Holiday-Visum erfuhr, nutzte ich die Chance für ein ganzes Jahr in Japan – und daraus wurden schließlich insgesamt fünf Jahre, in denen ich dort gelebt, gearbeitet und gereist bin.',
    en: 'My first trip to Japan in 2017 excited me so much that I had to go back. When I later heard about the working holiday visa, I took the chance for a whole year in Japan – and it turned into five years of living, working and travelling there.'
  },
  travel2: {
    de: 'Ich verbrachte längere Zeit in einzelnen Regionen, war viel draußen unterwegs und reiste oft spontan. Die Karte zeigt, wo ich gelebt, gearbeitet und gereist bin.',
    en: 'I spent longer stretches in single regions, was outdoors a lot and often travelled on a whim. The map shows where I lived, worked and travelled.'
  },
  tripsTitle: { de: 'Reise-Highlights', en: 'Travel highlights' },
  tripsIntro: {
    de: 'Einige Touren, die das Jahr besonders geprägt haben. Jede Reise hatte ein eigenes Tempo, eigene Menschen und kleine Routinen, die sich erst nach ein paar Tagen eingestellt haben.',
    en: 'Some of the trips that shaped that time most. Each had its own pace, its own people and small routines that only settled in after a few days.'
  },
  momentsTitle: { de: 'Besondere Momente', en: 'Moments' },
  momentsIntro: {
    de: 'Orte und Augenblicke, die mir besonders in Erinnerung geblieben sind.',
    en: 'Places and moments that stayed with me.'
  },
  prevMoment: { de: 'Vorheriger Moment', en: 'Previous moment' },
  nextMoment: { de: 'Nächster Moment', en: 'Next moment' }
}

const num = (i: number) => String(i + 1).padStart(2, '0')
const pick = (v: string | Localized) => (typeof v === 'string' ? v : l(v))

// Varied spans so the galleries read as placed, not as a uniform grid.
const tripLayout = [
  { cols: 'md:col-span-7', ratio: 'aspect-[3/2]' },
  { cols: 'md:col-span-5 md:mt-20', ratio: 'aspect-[4/3]' },
  { cols: 'md:col-span-4', ratio: 'aspect-[4/3]' },
  { cols: 'md:col-span-8', ratio: 'aspect-[3/2]' },
  { cols: 'md:col-span-6', ratio: 'aspect-[4/3]' },
  { cols: 'md:col-span-6 md:mt-16', ratio: 'aspect-[4/3]' },
  { cols: 'md:col-span-5', ratio: 'aspect-[4/3]' },
  { cols: 'md:col-span-7', ratio: 'aspect-[3/2]' },
  { cols: 'md:col-span-6 md:col-start-7', ratio: 'aspect-[4/3]' }
]

/* Lightbox: every photo on the page, in reading order. */
const photos = computed<LightboxItem[]>(() => [
  ...trips.flatMap(t => t.images.map(src => ({ src, title: l(t.title), eyebrow: pick(t.region), text: l(t.description) }))),
  ...moments.map(m => ({ src: m.image, title: l(m.title), eyebrow: l(m.location), text: l(m.description) }))
])
const photoIndex = ref<number | null>(null)
const openPhoto = (src: string) => {
  photoIndex.value = photos.value.findIndex(p => p.src === src)
}

/* Map links from the galleries. */
const japanMap = ref<{ showPlace: (id: string) => void, showRegion: (id: RegionId) => void, showRoute: (id: string) => void } | null>(null)

function showOnMap(target: MapTarget) {
  document.getElementById('karte')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  // Let the scroll get going so the zoom is seen, not missed.
  setTimeout(() => {
    if (target.place) japanMap.value?.showPlace(target.place)
    else if (target.route) japanMap.value?.showRoute(target.route)
    else if (target.region) japanMap.value?.showRegion(target.region)
  }, 350)
}

/* Moments filmstrip. */
const strip = ref<HTMLDivElement | null>(null)
const stripIndex = ref(0)

function stripStep() {
  const el = strip.value
  const first = el?.firstElementChild as HTMLElement | null
  if (!el || !first) return 0
  return first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0')
}

function onStripScroll() {
  const el = strip.value
  const step = stripStep()
  if (!el || !step) return
  // At the right edge the last card can't snap to the start; count it as reached.
  const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4
  stripIndex.value = atEnd ? moments.length - 1 : Math.round(el.scrollLeft / step)
}

function stepStrip(dir: number) {
  strip.value?.scrollBy({ left: dir * stripStep(), behavior: 'smooth' })
}
</script>
