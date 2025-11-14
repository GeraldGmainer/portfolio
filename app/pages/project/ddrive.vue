<template>
  <main class="min-h-screen bg-[#050816] text-slate-100">
    <section class="border-b border-white/5 bg-gradient-to-b from-[#050816] to-[#020617]">
      <div class="mx-auto max-w-6xl px-6 py-16 sm:py-20 lg:py-24">
        <div class="flex flex-col gap-10 lg:flex-row lg:items-center">
          <div class="flex-1">
            <p class="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 ring-1 ring-white/10">
              <span>Telematik · Flottenlösung</span>
            </p>
            <h1 class="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              D-Drive – Driving Assistant & Admin
            </h1>
            <p class="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Telematik-Lösung für Lkw- und Busfahrer mit Bluetooth-gekoppelter Alkoholmessung,
              GPS-Fahrtenaufzeichnung und Admin-Backend für Auswertungen, Reports und Rollenverwaltung.
            </p>

            <dl class="mt-8 grid gap-4 text-sm text-slate-300 sm:grid-cols-3">
              <div>
                <dt class="text-xs uppercase tracking-[0.18em] text-slate-500">Rolle</dt>
                <dd class="mt-1">Flutter App, Backend, Admin</dd>
              </div>
              <div>
                <dt class="text-xs uppercase tracking-[0.18em] text-slate-500">Plattformen</dt>
                <dd class="mt-1">Android · Web</dd>
              </div>
              <div>
                <dt class="text-xs uppercase tracking-[0.18em] text-slate-500">Zeitraum</dt>
                <dd class="mt-1">2022–2024</dd>
              </div>
            </dl>

            <div class="mt-8 flex flex-wrap gap-2 text-xs">
              <span
                  v-for="item in stack"
                  :key="item"
                  class="inline-flex items-center rounded-full bg-white/5 px-3 py-1 font-medium text-slate-200 ring-1 ring-white/10"
              >
                {{ item }}
              </span>
            </div>
          </div>

          <div class="flex-1">
            <div
                class="overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-b from-black/60 to-black/20 p-4 shadow-2xl shadow-black/60">
              <img
                  alt="D-Drive App Screenshot"
                  class="mx-auto h-[520px] w-auto max-w-full object-contain"
                  src="/images/ddrive.png"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-[#050816] py-16 sm:py-20">
      <div class="mx-auto max-w-6xl px-6">
        <h2 class="text-xl font-semibold tracking-tight text-white sm:text-2xl">Screenshots</h2>
        <p class="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
          Ausgewählte Ansichten aus Fahrer-App und Admin-Interface.
        </p>

        <div class="mt-6 grid gap-4 sm:grid-cols-3">
          <div
              v-for="s in screenshots"
              :key="s.alt"
              class="overflow-hidden rounded-3xl border border-white/10 bg-black/40"
          >
            <img
                :alt="s.alt"
                :src="s.src"
                class="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="border-t border-white/5 bg-[#050816] py-16 sm:py-20">
      <div class="mx-auto max-w-6xl px-6 grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div>
          <h2 class="text-xl font-semibold tracking-tight text-white sm:text-2xl">Projektfokus</h2>
          <ul class="mt-4 space-y-2 text-sm text-slate-300">
            <li v-for="item in focus" :key="item" class="flex gap-2">
              <span class="mt-[6px] inline-block h-1.5 w-1.5 rounded-full bg-sky-400"></span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
        <div>
          <h2 class="text-xl font-semibold tracking-tight text-white sm:text-2xl">Tech Stack</h2>
          <div class="mt-4 flex flex-wrap gap-2 text-xs">
            <span
                v-for="item in stack"
                :key="item"
                class="inline-flex items-center rounded-full bg-white/5 px-3 py-1 font-medium text-slate-200 ring-1 ring-white/10"
            >
              {{ item }}
            </span>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script lang="ts" setup>
const stack = [
  'Flutter',
  'Dart',
  'Bluetooth LE',
  'GPS Tracking',
  'Supabase',
  'PostgreSQL',
  'React Admin',
  'Node.js',
  'TypeScript'
]

const screenshots = [
  {
    src: '/images/ddrive.png',
    alt: 'D-Drive Fahrer Startscreen mit Alkoholtest'
  },
  {
    src: '/images/ddrive.png',
    alt: 'D-Drive Fahrtenliste mit GPS-Tracking'
  },
  {
    src: '/images/ddrive.png',
    alt: 'D-Drive Admin-Backend mit Auswertungen'
  }
]

const focus = [
  'Alkoholtest-Workflow mit Bluetooth-gekoppeltem Messgerät und verpflichtenden Checks vor Fahrtbeginn',
  'GPS-basierte Fahrtenaufzeichnung für Lkw- und Busflotten inklusive Auswertung und Historie',
  'React-Admin-Backend zur Verwaltung von Fahrern, Fahrzeugen, Rollen und Flottenrechten',
  'Supabase als zentrales Backend mit Auth, Datenhaltung und REST-Schnittstellen',
  'Robuste App-Architektur für den Einsatz im rauen Alltag von Fahrern'
]
</script>
