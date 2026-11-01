<template>
  <div class="pb-24 md:pb-32">
    <!-- The rattle opens the page: it's where the story started. -->
    <header class="mx-auto grid max-w-6xl gap-10 px-6 pt-32 md:grid-cols-12 md:items-end md:gap-8 md:pt-40">
      <div class="md:col-span-7">
        <UiEyebrow class="block rise">
          {{ $t('nav.woodworking') }}
        </UiEyebrow>
        <h1 class="rise rise-delay-1 mt-5 font-display text-5xl leading-[1] tracking-tight text-ink md:text-7xl">
          {{ l(copy.title) }}
        </h1>
        <blockquote class="rise rise-delay-2 mt-8 md:mt-10">
          <p class="font-display text-2xl italic leading-snug tracking-tight text-ink md:text-4xl">
            {{ l(copy.quote) }}
          </p>
        </blockquote>
        <p class="rise rise-delay-2 measure mt-6 text-lg leading-relaxed text-ink-muted">
          {{ l(copy.intro) }}
        </p>
      </div>

      <figure class="rise rise-delay-2 group relative aspect-[4/3] overflow-hidden rounded-md border border-line md:col-span-4 md:col-start-9 md:aspect-[4/5]">
        <img
          :src="rattle.image"
          :alt="l(rattle.title)"
          width="500"
          height="375"
          class="absolute inset-0 h-full w-full object-cover object-[44%_50%] transition-transform duration-700 ease-out-soft group-hover:scale-[1.03]"
        >
        <figcaption :class="captionClass">
          <span class="tabular-nums text-ink-muted">{{ num(1) }}</span>
          <span>{{ l(rattle.title) }}</span>
        </figcaption>
      </figure>
    </header>

    <section class="mx-auto mt-12 max-w-6xl px-6 md:mt-20">
      <!-- A flush mosaic: the large tiles span two rows of small ones, so both
           edges and every row line up. Dense flow lets the right-hand large
           tile backfill beside the two small ones that precede it. -->
      <div
        v-reveal
        class="grid grid-flow-dense grid-cols-2 gap-3 md:grid-cols-6 md:gap-4"
      >
        <figure
          v-for="(piece, i) in pieces"
          :key="piece.image"
          :class="tiles[piece.tile]"
          class="group relative aspect-[4/3] overflow-hidden rounded-md border border-line"
        >
          <img
            :src="piece.image"
            :alt="l(piece.title)"
            width="500"
            height="375"
            :loading="i > 2 ? 'lazy' : undefined"
            class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.03]"
          >
          <figcaption :class="captionClass">
            <span class="tabular-nums text-ink-muted">{{ num(i + 2) }}</span>
            <span>{{ l(piece.title) }}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
const l = useLocalized()

usePageSeo({
  title: { de: 'Holzhandwerk: Möbel und Spielzeug aus Massivholz', en: 'Woodworking: furniture and toys in solid wood' },
  description: {
    de: 'Holzarbeiten von Gerald Gmainer: Spielzeug, Möbel und Alltagshelfer aus Massivholz – vom Schaukelpferd bis zur Musikbox mit RFID-Karten.',
    en: 'Woodworking by Gerald Gmainer: toys, furniture and everyday helpers in solid wood – from a rocking horse to a music box with RFID cards.'
  },
  crumbs: [{ name: { de: 'Holzhandwerk', en: 'Woodworking' } }]
})

const copy = {
  title: { de: 'Holzarbeiten', en: 'Woodwork' },
  quote: {
    de: '„Angefangen hat alles mit einer kleinen Holzrassel für meinen Sohn.“',
    en: '“It all started with a small wooden rattle for my son.”'
  },
  intro: {
    de: 'Daraus wurde Schritt für Schritt eine Leidenschaft für Spielzeug, Möbel und Alltagshelfer aus Massivholz. Einige meiner Arbeiten habe ich auch in Japan verkauft.',
    en: 'Step by step, that became a passion for toys, furniture and everyday helpers in solid wood. I have also sold some of my pieces in Japan.'
  }
}

const num = (i: number) => String(i).padStart(2, '0')

const captionClass = 'absolute bottom-2 left-2 flex max-w-[calc(100%-1rem)] gap-2 rounded bg-navy-950/80 px-2 py-1 font-mono text-[11px] leading-snug text-ink'

const tiles = {
  large: 'col-span-2 md:col-span-4 md:row-span-2 md:aspect-auto',
  largeRight: 'col-span-2 md:col-span-4 md:col-start-3 md:row-span-2 md:aspect-auto',
  small: 'md:col-span-2',
  smallLeft: 'md:col-span-2 md:col-start-1',
  half: 'col-span-2 md:col-span-3'
}

const rattle = { title: { de: 'Holzrassel', en: 'Wooden rattle' }, image: '/images/rassel.webp' }

const pieces: { title: { de: string, en: string }, image: string, tile: keyof typeof tiles }[] = [
  { title: { de: 'Schaukelpferd', en: 'Rocking horse' }, image: '/images/pferd.webp', tile: 'large' },
  { title: { de: 'Spielzeuglastwagen', en: 'Toy truck' }, image: '/images/truck.webp', tile: 'small' },
  { title: { de: 'Musik Box mit RFID Karten', en: 'Music box with RFID cards' }, image: '/images/leobox.webp', tile: 'small' },
  { title: { de: 'Bierträger Deluxe', en: 'Deluxe beer carrier' }, image: '/images/kiste.webp', tile: 'smallLeft' },
  { title: { de: 'Sitzbank', en: 'Bench' }, image: '/images/bank.webp', tile: 'smallLeft' },
  { title: { de: 'DIY Tischkreissäge', en: 'DIY table saw' }, image: '/images/saw.webp', tile: 'largeRight' },
  { title: { de: 'Kinder-Tisch & Stuhl-Set', en: 'Children\'s table & chair set' }, image: '/images/tisch.webp', tile: 'half' },
  { title: { de: 'Baby Bett', en: 'Baby cot' }, image: '/images/bett.webp', tile: 'half' }
]
</script>
