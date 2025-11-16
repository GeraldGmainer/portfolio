<template>
  <main class="min-h-screen bg-[#0B1220] text-slate-200">
    <PageHeader
        :badges="['Working Holiday', 'Reisen', 'Japan']"
        :center="true"
        subtitle="Ein Jahr zwischen Großstadt und Natur: Arbeiten, reisen und unterwegs wie Einheimische leben. Von Hokkaido bis Okinawa – zu Fuß, per Auto, Motorrad und mit viel Neugier."
        title="Japan Aufenthalt"
    />


    <section class="border-t border-white/5 bg-[#050816] py-16 sm:py-20">
      <div class="mx-auto max-w-6xl px-6 lg:items-center">
        <div class="">
          <h2 class="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Reise durch ganz Japan
          </h2>
          <p class="text-sm leading-relaxed text-slate-300 sm:text-base mt-3">
            Meine erste Japanreise im Jahr 2017 hat mich so begeistert, dass ich unbedingt zurückkehren wollte.
            Als ich später vom Working-Holiday-Visum erfuhr, nutzte ich die Chance für ein ganzes Jahr in Japan – und daraus wurden schließlich insgesamt fünf Jahre, in denen ich dort gelebt, gearbeitet und gereist bin
          </p>
          <p class="text-sm leading-relaxed text-slate-300 sm:text-base mt-3">
            Ich verbrachte längere Zeit in einzelnen Regionen, war viel draußen unterwegs und reiste oft spontan. Die Karte zeigt, wo ich gelebt, gearbeitet und gereist bin.
          </p>
        </div>
        <div class="mt-8">
          <div class="relative w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4">
            <img
                alt="Japan Karte"
                class="w-full h-full rounded-2xl object-contain"
                src="/images/japanMap2.png"
            />

            <div class="absolute left-6 top-6 space-y-4 z-20">
              <div class="flex items-center gap-3">
                <span class="h-5 w-14 rounded bg-[#e0bd00]"></span>
                <span class="text-xs lg:text-sm text-white font-semibold">2017</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="h-5 w-14 rounded bg-[#0023ff]"></span>
                <span class="text-xs lg:text-sm text-white font-semibold">2018</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="h-5 w-14 rounded bg-[#00ff1a]"></span>
                <span class="text-xs lg:text-sm text-white font-semibold">2019</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="h-5 w-14 rounded bg-[#ff00ff]"></span>
                <span class="text-xs lg:text-sm text-white font-semibold">2020</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="h-5 w-14 rounded bg-[#a5a63c]"></span>
                <span class="text-xs lg:text-sm text-white font-semibold">2021</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="h-5 w-14 rounded bg-[#67f6ff]"></span>
                <span class="text-xs lg:text-sm text-white font-semibold">2022</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="h-5 w-14 rounded bg-[#e85f00]"></span>
                <span class="text-xs lg:text-sm text-white font-semibold">2023</span>
              </div>
            </div>
          </div>

          <p class="mt-3 text-center text-[11px] text-slate-400">
            Farbige Markierungen zeigen, in welchen Jahren und Regionen ich unterwegs war
          </p>
        </div>
      </div>
    </section>

    <section class="border-t border-white/5 bg-[#050816] py-16 sm:py-20">
      <div class="mx-auto max-w-6xl px-6">
        <div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 class="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Reise-Highlights
            </h2>
            <p class="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
              Einige Touren, die das Jahr besonders geprägt haben. Jede Reise hatte ein eigenes Tempo,
              eigene Menschen und kleine Routinen, die sich erst nach ein paar Tagen eingestellt haben.
            </p>
          </div>
        </div>

        <div class="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <article
              v-for="trip in trips"
              :key="trip.title"
              class="flex h-full flex-col rounded-3xl border border-white/10 bg-gradient-to-b from-[#0B1220] to-[#020617] p-5 ring-1 ring-white/5"
          >
            <div class="mb-3 flex items-center justify-between gap-3 text-xs text-slate-400">
              <span class="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-1 ring-1 ring-white/10">
                <Icon class="text-sky-300" name="lucide:map-pin" size="14"/>
                <span>{{ trip.region }}</span>
              </span>
              <span>{{ trip.duration }}</span>
            </div>
            <h3 class="text-base font-semibold text-white">
              {{ trip.title }}
            </h3>
            <p class="mt-2 flex-1 text-sm leading-relaxed text-slate-300">
              {{ trip.description }}
            </p>
            <div class="mt-4 flex flex-wrap gap-1.5 text-[11px]">
              <span
                  v-for="tag in trip.tags"
                  :key="tag"
                  class="rounded-full bg-white/5 px-2 py-1 text-slate-200 ring-1 ring-white/10"
              >
                {{ tag }}
              </span>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="border-t border-white/5 bg-[#050816] py-16 sm:py-20">
      <div class="mx-auto max-w-6xl px-6">
        <div class="flex flex-col gap-6 lg:flex-row">
          <div class="flex-1">
            <h2 class="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Unterwegs wie Einheimische
            </h2>
            <p class="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
              Das Working-Holiday-Visum hat es mir ermöglicht, in Cafés, Hostels oder auf Kurzjobs zu arbeiten
              und gleichzeitig längere Zeit an einem Ort zu bleiben. Statt nur Highlights abzuhaken, ging es
              mir darum, die kleinen Dinge mitzunehmen: Supermärkte, Pendelzüge, Regenzeiten, lokale Feste.
            </p>
            <p class="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
              Viele Strecken bin ich mit langsamen Zügen, zu Fuß oder per Anhalter gefahren. Das hat Zeit gekostet,
              aber dafür ergaben sich Gespräche und Begegnungen, die man auf der Schnellzugstrecke kaum erlebt.
            </p>
            <ul class="mt-4 space-y-3 text-sm text-slate-300">
              <li class="flex gap-2">
                <span class="mt-1 text-sky-400">
                  <Icon name="lucide:dot" size="16"/>
                </span>
                <span>Übernachtungen in Guesthouses, Hostels, Minshuku und einmal auch im Zelt neben einem Onsen.</span>
              </li>
              <li class="flex gap-2">
                <span class="mt-1 text-sky-400">
                  <Icon name="lucide:dot" size="16"/>
                </span>
                <span>Sprachmix aus einfachem Japanisch, Englisch, Händen und Füßen – meistens hat es gut funktioniert.</span>
              </li>
              <li class="flex gap-2">
                <span class="mt-1 text-sky-400">
                  <Icon name="lucide:dot" size="16"/>
                </span>
                <span>Längere Aufenthalte in kleineren Städten statt nur Tokio, Osaka und Kyoto.</span>
              </li>
            </ul>
          </div>
          <div class="flex-1">
            <div class="grid gap-4 sm:grid-cols-2">
              <figure
                  v-for="m in moments"
                  :key="m.title"
                  class="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 ring-1 ring-white/5"
              >
                <div class="aspect-[4/3] w-full overflow-hidden">
                  <img
                      :alt="m.title"
                      :src="m.image"
                      class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <figcaption class="p-3">
                  <p class="text-xs font-semibold text-white">
                    {{ m.title }}
                  </p>
                  <p class="mt-1 text-[11px] text-slate-400">
                    {{ m.location }}
                  </p>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="border-t border-white/5 bg-[#050816] pb-24 pt-16 sm:pb-28 sm:pt-20">
      <div class="mx-auto max-w-4xl px-6 text-center">
        <h2 class="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Was ich aus Japan mitgenommen habe
        </h2>
        <p class="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
          Das Jahr in Japan hat mich stark geprägt – persönlich und auch beruflich. Geduld, genaue Beobachtung und
          Respekt vor Details sind Dinge, die ich heute in Design, Code und Zusammenarbeit wiederfinde.
        </p>
        <div class="mt-8 grid gap-4 text-sm text-slate-200 sm:grid-cols-3">
          <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-5">
            <p class="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              Tempo
            </p>
            <p class="mt-2 text-sm">
              Langsam reisen, dafür intensiver – ein Prinzip, das auch in Projekten hilft, fokussiert zu bleiben.
            </p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-5">
            <p class="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              Details
            </p>
            <p class="mt-2 text-sm">
              Kleine Details entscheiden oft über das Gefühl, ob etwas stimmig wirkt – in Apps wie im Alltag.
            </p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-5">
            <p class="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              Begegnungen
            </p>
            <p class="mt-2 text-sm">
              Gute Projekte funktionieren wie Reisen: mit klaren Zielen, aber offen für Menschen und Umwege.
            </p>
          </div>
        </div>

        <div class="mt-10 flex flex-wrap justify-center gap-3 text-sm">
          <NuxtLink
              class="inline-flex items-center gap-2 rounded-2xl bg-white text-slate-900 px-5 py-3 font-semibold ring-1 ring-white/20"
              to="/projects"
          >
            <Icon name="lucide:briefcase" size="18"/>
            <span>Zu den Projekten</span>
          </NuxtLink>
          <NuxtLink
              class="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-5 py-3 font-semibold text-white ring-1 ring-white/15 backdrop-blur hover:bg-white/15"
              to="/contact"
          >
            <Icon name="lucide:mail" size="18"/>
            <span>Fragen zu Japan oder Working Holiday?</span>
          </NuxtLink>
        </div>
      </div>
    </section>
  </main>

</template>

<script lang="ts" setup>
const trips = [
  {
    title: '21-tägige Fernwanderung in Hokkaido',
    region: 'Hokkaido',
    duration: '21 Tage',
    description:
        'Eine mehrwöchige Wanderung durch den Norden Japans mit Zelt, Hütten und kleinen Pensionen. Viel unberührte Natur, lange Etappen und stille Abende in Onsen-Dörfern.',
    tags: ['Fernwanderung', 'Berge', 'Onsen', 'Wildlife']
  },
  {
    title: 'Drei Wochen Okinawa und Inselhüpfen',
    region: 'Okinawa',
    duration: '3 Wochen',
    description:
        'Subtropisches Klima, glasklares Wasser und ein deutlich anderes Tempo als auf den Hauptinseln. Zwischen Schnorcheln, kleinen Häfen und Abenden mit Sanshin-Musik.',
    tags: ['Meer', 'Strände', 'Inselhüpfen', 'Subtropen']
  },
  {
    title: 'Per Anhalter durch Kyushu',
    region: 'Kyushu',
    duration: 'Mehrere Etappen',
    description:
        'Hitchhiking über Landstraßen, spontane Einladungen zum Essen und unerwartete Umwege. So sind Gespräche entstanden, die es im Schnellzug nie gegeben hätte.',
    tags: ['Hitchhiking', 'Onsen', 'Landleben', 'Begegnungen']
  },
  {
    title: 'Roadtrips mit Auto und Motorrad',
    region: 'Honshu · Hokkaido',
    duration: 'Mehrere Wochen',
    description:
        'Flexible Routen, abgelegene Küstenstraßen und kleine Pässe im Landesinneren. Praktisch, um Orte zu erreichen, an denen kaum noch Busse fahren.',
    tags: ['Roadtrip', 'Motorrad', 'Küstenstraßen', 'Flexibilität']
  },
  {
    title: 'Alltag in kleineren Städten',
    region: 'Honshu',
    duration: 'Mehrere Monate',
    description:
        'Länger an einem Ort bleiben, Stammcafé finden, Nachbarschaft kennen lernen und Supermärkte vergleichen. Der Alltag war oft spannender als einzelne Sehenswürdigkeiten.',
    tags: ['Alltag', 'Working Holiday', 'Sprache', 'Routinen']
  },
  {
    title: 'Städte, Festivals und Kurztrips',
    region: 'Tokio · Osaka · Kyoto',
    duration: 'Verteilt über das Jahr',
    description:
        'Klassische Highlights, aber mit dem Blick darauf, wie Menschen dort wirklich leben: Pendeln, Nachbarschaftsfeste, kleine Izakayas in Nebenstraßen.',
    tags: ['Stadtleben', 'Kultur', 'Festivals', 'Food']
  }
]

const moments = [
  {
    title: 'Morgenstimmung in den Bergen Hokkaidos',
    location: 'Hokkaido',
    image: '/images/japan/hokkaido-hike.jpg'
  },
  {
    title: 'Kleine Straße auf einer Insel bei Okinawa',
    location: 'Okinawa',
    image: '/images/japan/okinawa-road.jpg'
  },
  {
    title: 'Mitgenommen werden beim Hitchhiken',
    location: 'Kyushu',
    image: '/images/japan/kyushu-hitchhike.jpg'
  },
  {
    title: 'Abendlicht nach einer Motorrad-Etappe',
    location: 'Honshu',
    image: '/images/japan/honshu-bike.jpg'
  }
]
</script>
