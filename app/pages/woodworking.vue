<template>
  <main class="min-h-screen bg-[#0B1220] text-slate-200">
    <PageHeader
        subtitle="Angefangen hat alles mit einer kleinen Holzrassel für meinen Sohn. Daraus wurde Schritt für Schritt eine Leidenschaft für Spielzeug, Möbel und Alltagshelfer aus Massivholz."
        title="Holzarbeiten"
    />

    <section id="woodwork" class="mx-auto max-w-6xl px-6 pb-24">
      <div class="mt-10 grid gap-6 md:grid-cols-3">
        <figure
            v-for="w in woodProjects"
            :key="w.title"
            class="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 ring-1 ring-white/5 transition hover:-translate-y-0.5 hover:ring-white/20"
        >
          <div class="aspect-[4/3] w-full overflow-hidden">
            <img
                :alt="w.title"
                :src="w.image"
                class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
          <figcaption class="p-5">
            <h3 class="text-base font-semibold text-white">
              {{ w.title }}
            </h3>
          </figcaption>
        </figure>
      </div>
    </section>
  </main>
</template>

<script lang="ts" setup>
useHead({title: "Holzhandwerk"})

const woodProjects = [
  {title: 'Schaukelpferd', image: '/images/pferd.png'},
  {title: 'Spielzeuglastwagen', image: '/images/truck.png'},
  {title: 'Kinder-Tisch & Stuhl-Set', image: '/images/tisch.png'},
  {title: 'Musik Box mit RFID Karten', image: '/images/leobox.png'},
  {title: 'Sitzbank', image: '/images/bank.png'},
  {title: 'DIY Tischkreissäge', image: '/images/saw.png'},
  {title: 'Bierträger Deluxe', image: '/images/kiste.png'},
  {title: 'Holzrassel', image: '/images/rassel.png'},
  {title: 'Baby Bett', image: '/images/bett.png'}
]
</script>
