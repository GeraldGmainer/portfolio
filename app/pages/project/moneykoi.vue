<template>
  <main class="min-h-screen bg-[#050816] text-slate-100">
    <section class="border-b border-white/5 bg-gradient-to-b from-[#050816] to-[#020617]">
      <div class="mx-auto max-w-6xl px-6 py-16 sm:py-20 lg:py-24">
        <div class="flex flex-col gap-10 lg:flex-row lg:items-center">
          <div class="flex-1">
            <p class="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 ring-1 ring-white/10">
              <span>Produktiv · Eigenprojekt</span>
            </p>
            <h1 class="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
              MoneyKoi – Offline-First Budget App
            </h1>
            <p class="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Haushaltsbuch-App mit Fokus auf Offline-First, klarer Visualisierung von Einnahmen und Ausgaben
              sowie einer für den Alltag optimierten UX. Supabase dient als synchronisierbares Backend,
              die App bleibt auch ohne Internet vollständig nutzbar.
            </p>

            <dl class="mt-8 grid gap-4 text-sm text-slate-300 sm:grid-cols-3">
              <div>
                <dt class="text-xs uppercase tracking-[0.18em] text-slate-500">Rolle</dt>
                <dd class="mt-1">Produkt, Design, Development</dd>
              </div>
              <div>
                <dt class="text-xs uppercase tracking-[0.18em] text-slate-500">Plattformen</dt>
                <dd class="mt-1">iOS · Android</dd>
              </div>
              <div>
                <dt class="text-xs uppercase tracking-[0.18em] text-slate-500">Zeitraum</dt>
                <dd class="mt-1">seit 2023</dd>
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
                  alt="MoneyKoi App Screenshot"
                  class="mx-auto h-[520px] w-auto max-w-full object-contain"
                  src="/images/moneykoi.png"
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
          Einblicke in die wichtigsten Ansichten: Dashboard, Transaktionsliste und Detailansicht.
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
  'Supabase',
  'PostgreSQL',
  'SQLite',
  'Figma',
  'Supabase Edge Functions'
]

const screenshots = [
  {
    src: '/images/moneykoi.png',
    alt: 'MoneyKoi Dashboard'
  },
  {
    src: '/images/moneykoi.png',
    alt: 'MoneyKoi Transaktionsliste'
  },
  {
    src: '/images/moneykoi.png',
    alt: 'MoneyKoi Transaktionsdetails'
  }
]

const focus = [
  'Offline-First-Architektur mit lokalem Cache und späterer Synchronisation über Supabase',
  'Klares Finanzdashboard mit Fokus auf Monatssicht, Kategorien und Trends',
  'Konsequente UX für schnelle Erfassung von Einnahmen und Ausgaben im Alltag',
  'Mehrsprachigkeit und flexible Kategorien- und Kontenstruktur',
  'Technische Basis für spätere Erweiterung um Analysen und Kollaborationsfeatures'
]
</script>
