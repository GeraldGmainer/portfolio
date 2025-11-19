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
                src="/images/JapanMap.png"
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
              class="flex h-full flex-col rounded-3xl border border-white/10 bg-gradient-to-b from-[#0B1220] to-[#020617] ring-1 ring-white/5 overflow-hidden"
          >
            <div class="aspect-[4/3] w-full overflow-hidden">
              <img
                  :alt="trip.title"
                  :src="trip.image"
                  class="h-full w-full object-cover transition duration-500 hover:scale-105"
              />
            </div>

            <div class="p-5 flex flex-col flex-1">
              <div class="mb-3 flex items-center justify-between gap-3 text-xs text-slate-400">
      <span class="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-1 ring-1 ring-white/10">
        <Icon class="text-sky-300" name="lucide:map-pin" size="14"/>
        <span>{{ trip.region }}</span>
      </span>
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
            </div>
          </article>

        </div>
      </div>
    </section>

    <section class="border-t border-white/5 bg-[#050816] py-16 sm:py-20">
      <div class="mx-auto max-w-6xl px-6">
        <div>
          <h2 class="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Besondere Momente
          </h2>
          <p class="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
            Orte und Augenblicke, die mir besonders in Erinnerung geblieben sind.
          </p>
        </div>

        <div class="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <article
              v-for="m in moments"
              :key="m.title"
              class="flex h-full flex-col rounded-3xl border border-white/10 bg-gradient-to-b from-[#0B1220] to-[#020617] ring-1 ring-white/5 overflow-hidden"
          >
            <div class="aspect-[4/3] w-full overflow-hidden">
              <img
                  :alt="m.title"
                  :src="m.image"
                  class="h-full w-full object-cover transition duration-500 hover:scale-105"
              />
            </div>

            <div class="p-5 flex flex-col flex-1">
              <div class="mb-2 flex items-center justify-between text-xs text-slate-400">
            <span class="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-1 ring-1 ring-white/10">
              <Icon class="text-sky-300" name="lucide:map-pin" size="14"/>
              <span>{{ m.location }}</span>
            </span>
              </div>

              <h3 class="text-base font-semibold text-white">
                {{ m.title }}
              </h3>

              <p class="mt-2 flex-1 text-sm leading-relaxed text-slate-300">
                {{ m.description }}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  </main>

</template>

<script lang="ts" setup>
useHead({title: "Japan"})

const trips = [
  {
    title: '21-tägige Fernwanderung in Hokkaido',
    region: 'Hokkaido',
    description:
        'Eine mehrwöchige Wanderung durch den Norden Japans, meistens im Zelt. Viel unberührte Natur, lange Etappen und zwei überraschende Begegnungen mit Bären auf abgelegenen Bergpfaden.',
    tags: ['Fernwanderung', 'Berge', 'Wildlife'],
    image: '/images/hike.png'
  },
  {
    title: 'Drei Wochen Okinawa und Inselhüpfen',
    region: 'Okinawa',
    description:
        'Subtropisches Klima, glasklares Wasser und ein deutlich anderes Tempo als auf den Hauptinseln. Zwischen Schnorcheln, kleinen Häfen und viel Kultur.',
    tags: ['Meer', 'Strände', 'Inselhüpfen', 'Subtropen'],
    image: '/images/okinawa.png'
  },
  {
    title: 'Per Anhalter durch Kyushu',
    region: 'Kyushu',
    description:
        'Hitchhiking über Landstraßen, spontane Einladungen zum Essen und unerwartete Umwege. So sind Gespräche entstanden, die es im Schnellzug nie gegeben hätte.',
    tags: ['Hitchhiking', 'Onsen', 'Landleben', 'Begegnungen'],
    image: '/images/hitchhike.png'
  },
  {
    title: 'Roadtrips mit Auto und Motorrad',
    region: 'Honshu · Hokkaido',
    description:
        'Flexible Routen, abgelegene Küstenstraßen und kleine Pässe im Landesinneren. Praktisch, um Orte zu erreichen, an denen kaum noch Busse fahren.',
    tags: ['Roadtrip', 'Motorrad', 'Küstenstraßen', 'Flexibilität'],
    image: '/images/bike.png'
  },
  {
    title: 'Alltag in Tokio',
    region: 'Tokio',
    description:
        'Tokio besteht aus unzähligen Vierteln, und selbst nach Monaten entdeckt man ständig neue Straßen, Orte und Routinen.',
    tags: ['Stadtleben', 'Bars', 'Nachbarschaften', 'Kultur'],
    image: '/images/cart.png'
  },
  {
    title: 'Städte, Festivals und Kurztrips',
    region: 'Tokio · Osaka · Aomori',
    description:
        'Klassische Highlights, Sommerfeste und kleine Kurztrips – mit vielen Momenten, die man nur erlebt, wenn man länger in der Region unterwegs ist.',
    tags: ['Stadtleben', 'Kultur', 'Festivals', 'Food'],
    image: '/images/fest.png'
  },
  {
    title: 'Ramen, Izakaya-Abende und kleine versteckte Restaurants',
    region: 'Japan',
    description: 'Gerichte, die spätabends nach langen Tagen doppelt so gut schmecken – von winzigen Ramenläden bis zu Izakayas, in denen man schnell mit Leuten ins Gespräch kommt.',
    image: '/images/food.png',
    tags: ['Food', 'Izakaya', 'Ramen', 'Alltag'],
  },
  {
    title: 'Snowboardtage in tiefem Pulverschnee',
    region: 'Hokkaido · Nikko',
    description: 'Tiefe Powder-Tage, frühe Starts und Abfahrten auf breiten, unberührten Flächen – Winter in seiner besten Form.',
    image: '/images/snowboard.png',
    tags: ['Winter', 'Snowboard', 'Powder', 'Outdoor'],
  },
  {
    title: 'Ruhige Tempel und eindrucksvolle Buddha-Statuen',
    region: 'Kansai · Nara · Kamakura',
    description: 'Zwischen alten Tempeln, Räucherstäbchen und großen Buddha-Statuen fühlt sich Japan oft zeitlos an.',
    image: '/images/buddha.png',
    tags: ['Kultur', 'Tempel', 'Buddha', 'Tradition'],
  }

]

const moments = [
  {
    title: 'Tokio bei Nacht',
    location: 'Tokio',
    description: 'Neon, kleine Gassen, ruhige Nebenstraßen und volle Bahnhöfe – je später es wird, desto klarer spürt man den Mix aus Tempo und Alltag.',
    image: '/images/tokyotower.png'
  },
  {
    title: 'Motorradfahren während der Kirschblütenzeit',
    location: 'Honshu',
    description: 'Straßen voller Blüten, milde Temperaturen und die ersten warmen Tage des Jahres – perfekt für entspannte Touren durchs Land.',
    image: '/images/sakura.png'
  },
  {
    title: 'Aussichtsplatz am Berg bei Amanohashidate',
    location: 'Kyoto Präfektur',
    description: 'Mein Lieblingsspot: stille Morgen, Blick über die Sandbank und ein Ort, an den ich immer wieder zurückgekehrt bin.',
    image: '/images/amanohashidate.png'
  },
  {
    title: 'Wandern in den Bergen',
    location: 'Nikko',
    description: 'Lange Straßen durch stille Natur und ein Hauch Österreich in der Umgebung – ein Ort, der sofort vertraut wirkt.',
    image: '/images/nikko.png'
  },
  {
    title: 'Übernachtung im Tempel',
    location: 'Kōya-san · Osaka',
    description: 'Eine stille Nacht im Tempel auf Kōya-san – Sutren, Nebel und ein Frühstück im Morgengrauen.',
    image: '/images/koya.png'
  },
  {
    title: 'Altes Dorf Shirakawago',
    location: 'Gifu',
    description: 'Traditionelle Gasshō-Häuser, ein stilles Dorfgefühl und eine Atmosphäre, die sich anfühlt wie eine andere Zeit.',
    image: '/images/shirakawago.png'
  }
]
</script>
