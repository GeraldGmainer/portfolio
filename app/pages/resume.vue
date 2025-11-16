<template>
  <main class="min-h-screen bg-[#0B1220] text-slate-200">
    <PageHeader
        :badges="[
    'Garsten, Österreich · Remote/Hybrid',
    'Deutsch · Englisch · Japanisch',
    'Web · App · 3D'
  ]"
        subtitle="Gerald Gmainer · Full-Stack & 3D · Österreich"
        title="Lebenslauf"
    >
      <template #actions>
        <a
            class="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/15 backdrop-blur transition hover:bg-white/15"
            href="/downloads/Lebenslauf_Gmainer_public.pdf"
            rel="noopener"
            target="_blank"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
            <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <path d="M15 3h6v6"/>
            <path d="M10 14L21 3"/>
          </svg>
          PDF öffnen
        </a>
      </template>
    </PageHeader>

    <section class="mx-auto max-w-6xl px-6 pb-20 mt-8">
      <div class="grid gap-8 lg:grid-cols-[1fr]">
        <div class="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div class="flex items-center gap-3">
            <span
                class="inline-grid h-9 w-9 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30">🗂️</span>
            <h2 class="text-xl font-semibold">Eigene Projekte</h2>
          </div>

          <div class="mt-6 relative pl-6">
            <span class="absolute left-0 top-2 h-2 w-2 rounded-full bg-emerald-400"></span>
            <div class="flex flex-wrap items-baseline justify-between gap-2">
              <h3 class="font-semibold text-white">MoneyKoi</h3>
              <span class="text-xs text-slate-400">seit 2024</span>
            </div>
            <p class="text-sm text-slate-300">Haushaltsbuch-App mit Offline-First, sauberer UI und Supabase-Backend.</p>

            <ul class="mt-3 space-y-2 text-sm text-slate-300">
              <li class="flex gap-2"><span class="text-emerald-400">•</span><span>Flutter App (Android/iOS), lokaler Datenspeicher, konfliktarmer Sync</span>
              </li>
              <li class="flex gap-2"><span class="text-emerald-400">•</span><span>Supabase mit RLS, Triggern, Migrations und Edge Functions</span>
              </li>
              <li class="flex gap-2"><span class="text-emerald-400">•</span><span>Inklusive moderner Next.js-Weboberfläche für Haushaltsbuch-Führung und Verwaltung</span>
              </li>
            </ul>

            <div class="mt-3 flex flex-wrap gap-2">
              <span v-for="t in ['Flutter','Supabase','Next.js','PostgreSQL','Sentry','Offline-First']" :key="t"
                    class="rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-slate-300 ring-1 ring-white/10">{{
                  t
                }}</span>
            </div>

            <div class="mt-4 flex flex-wrap gap-2">
              <a
                  class="inline-flex items-center gap-1 rounded-xl bg-white text-slate-900 px-3.5 py-2 text-sm font-semibold ring-1 ring-white/20"
                  href="https://moneykoi.app"
                  rel="noopener"
                  target="_blank"
              >
                <span>Website</span>
                <Icon name="lucide:arrow-up-right" size="16"/>
              </a>
              <a
                  class="inline-flex items-center gap-1 rounded-xl bg-white/10 px-3.5 py-2 text-sm font-semibold text-white ring-1 ring-white/15 hover:bg-white/15"
                  href="https://github.com/GeraldGmainer/moneykoi"
                  rel="noopener"
                  target="_blank"
              >
                <span>GitHub</span>
                <Icon name="simple-icons:github" size="16"/>
              </a>
            </div>
          </div>
        </div>

        <div class="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div class="flex items-center gap-3">
          <span
              class="inline-grid h-9 w-9 place-items-center rounded-2xl bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-400/30"
          >🧩</span>

            <div class="flex w-full items-center">
              <h2 class="text-xl font-semibold">Berufserfahrung</h2>
              <span class="ml-auto text-sm font-normal text-slate-400">11 Jahre</span>
            </div>
          </div>

          <ol class="mt-6 space-y-8">
            <li v-for="job in experience" :key="job.role" class="relative pl-6">
              <span class="absolute left-0 top-2 h-2 w-2 rounded-full bg-cyan-400"></span>
              <div class="flex flex-wrap items-baseline justify-between gap-2">
                <h3 class="font-semibold text-white">{{ job.role }}</h3>
                <div class="flex flex-col items-end text-xs">
                  <span class="text-slate-400">{{ job.time }}</span>
                  <span
                      v-if="formatExperienceDuration(job.time)"
                      class="text-[11px] text-slate-500"
                  >
        {{ formatExperienceDuration(job.time) }}
      </span>
                </div>
              </div>
              <p class="text-sm text-slate-300">{{ job.company }}</p>
              <ul class="mt-3 list-outside space-y-2 text-sm text-slate-300">
                <li
                    v-for="b in job.bullets"
                    :key="b"
                    class="flex gap-2"
                >
                  <span class="text-cyan-400">•</span><span>{{ b }}</span>
                </li>
              </ul>
              <div class="mt-3 flex flex-wrap gap-2  max-w-2xl">
                <span v-for="stack in job.stack"
                      :key="stack"
                      class="rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-slate-300 ring-1 ring-white/10">
                  {{ stack }}
                </span>
              </div>
              <div v-if="job.links?.length" class="mt-3 flex flex-wrap gap-2">
                <a
                    v-for="l in job.links"
                    :key="l.href"
                    :href="l.href"
                    class="inline-flex items-center rounded-xl bg-white/10 px-3.5 py-1 text-sm font-semibold text-white ring-1 ring-white/15 hover:bg-white/15"
                    rel="noopener"
                    target="_blank"
                >
                  {{ l.label }} ↗
                </a>
              </div>
            </li>

          </ol>
        </div>

        <div class="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div class="flex items-center gap-3">
            <span
                class="inline-grid h-9 w-9 place-items-center rounded-2xl bg-blue-500/15 text-blue-300 ring-1 ring-blue-400/30">🎓</span>
            <h2 class="text-xl font-semibold">Ausbildung</h2>
          </div>
          <ol class="mt-6 space-y-6">
            <li v-for="e in education" :key="e.title" class="relative pl-6">
              <span class="absolute left-0 top-2 h-2 w-2 rounded-full bg-blue-400"></span>
              <div class="flex flex-wrap items-baseline justify-between gap-2">
                <h3 class="font-semibold text-white">{{ e.title }}</h3>
                <span class="text-xs text-slate-400">{{ e.time }}</span>
              </div>
              <p class="text-sm text-slate-300">{{ e.school }}</p>
              <p v-if="e.details" class="mt-1 text-sm text-slate-400">{{ e.details }}</p>
            </li>
          </ol>
        </div>

        <div class="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div class="flex items-center gap-3">
            <span
                class="inline-grid h-9 w-9 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30">🏷️</span>
            <h2 class="text-xl font-semibold">Zertifikate & Sonstiges</h2>
          </div>
          <ul class="mt-6 grid gap-3 sm:grid-cols-2">
            <li class="rounded-xl bg-[#0B1220] p-4 text-sm ring-1 ring-white/10">Certified Scrum Master · 2024</li>
            <li class="rounded-xl bg-[#0B1220] p-4 text-sm ring-1 ring-white/10">
              <a class="underline decoration-white/30 underline-offset-2 hover:decoration-white"
                 href="https://zuhoerakademie.at/" rel="noopener"
                 target="_blank">
                Kommunikationstraining · 2024 – Zuhörakademie (Jürgen Melmuka) ↗
              </a>
            </li>
            <li class="rounded-xl bg-[#0B1220] p-4 text-sm ring-1 ring-white/10">A &amp; B Führerschein</li>
            <li class="rounded-xl bg-[#0B1220] p-4 text-sm ring-1 ring-white/10">Working Holiday &amp; Berufserfahrung
              in Japan
            </li>
          </ul>
        </div>
      </div>
    </section>
  </main>
</template>
<script lang="ts" setup>
const formatYearsMonthsDe = (years: number, months: number): string => {
  const parts: string[] = []
  if (years > 0) {
    parts.push(years === 1 ? '1 Jahr' : `${years} Jahre`)
  }
  if (months > 0) {
    parts.push(months === 1 ? '1 Monat' : `${months} Monate`)
  }
  return parts.join(' ')
}

const formatExperienceDuration = (time: string): string | null => {
  const parts = time.split('–').map(p => p.trim())
  if (parts.length !== 2) return null

  const [startStr, rawEndStr] = parts
  const endStr = rawEndStr.toLowerCase()

  const monthYearRegex = /^(\d{2})\/(\d{4})$/
  const yearRegex = /^(\d{4})$/

  const startMonthYearMatch = startStr.match(monthYearRegex)

  if (startMonthYearMatch) {
    const [, sm, sy] = startMonthYearMatch
    const startMonth = Number(sm)
    const startYear = Number(sy)

    let endYear: number
    let endMonth: number

    const endMonthYearMatch = rawEndStr.match(monthYearRegex)
    if (!endMonthYearMatch) return null
    const [, em, ey] = endMonthYearMatch
    endMonth = Number(em)
    endYear = Number(ey)

    const startTotal = startYear * 12 + (startMonth - 1)
    const endTotal = endYear * 12 + (endMonth - 1)
    const diffMonths = endTotal - startTotal

    if (diffMonths <= 0) return null

    const years = Math.floor(diffMonths / 12)
    const months = diffMonths % 12
    return formatYearsMonthsDe(years, months)
  }

  const startYearMatch = startStr.match(yearRegex)
  const endYearMatch = rawEndStr.match(yearRegex)

  if (startYearMatch && endYearMatch) {
    const startYear = Number(startYearMatch[1])
    const endYear = Number(endYearMatch[1])
    const diffYears = endYear - startYear
    if (diffYears <= 0) return null
    return formatYearsMonthsDe(diffYears, 0)
  }

  return null
}

const education = [
  {
    title: 'HTL Steyr · Elektronik mit Computer- und Leittechnik',
    school: 'Höhere Abteilung',
    time: '2004–2011',
    details: ''
  },
]

const experience = [
  {
    role: 'Teamlead & Software Entwickler',
    company: 'Objectbay GmbH',
    time: '06/2024 – 01/2026',
    bullets: [
      'Backend-Modernisierung für Security-Software',
      'Mobile App und Admin-Web für Sommerrodelbahnen',
      'Regelwerks- und Schadenmanagement für Versicherungsverbund',
      'Web- und App-gestütztes Finanzmanagement-Tool mit Beraterunterstützung',
      'Weiterentwicklung interner Tools'
    ],
    stack: ['Spring Boot', 'Angular', 'React', 'Flutter', 'Supabase', 'Docker', 'Keycloak', 'Scrum']
  },
  {
    role: 'Software Entwickler',
    company: 'Aescudata GmbH',
    time: '03/2024 – 05/2024',
    bullets: [
      'Neuentwicklung der bestehenden AngularJS Software auf moderne Angular-17-Architektur',
      'State-Management mit ngrx/rxJS'
    ],
    stack: ['Angular', 'Java', 'Spring Boot', 'Scrum']
  },
  {
    role: 'Senior Software Entwickler',
    company: 'Designium Inc. (Japan)',
    time: '02/2020 – 12/2023',
    bullets: [
      'Programming-Dojos vorbereitet und durchgeführt',
      '3D-Konfigurator für Schulrucksäcke',
      'AR- & VR Experimente',
      'Apps & Admin-Web für D-Drive und Schneepflugdienst',
      'Reiseführer-App für Aizuwakamatsu',
      'D-Drive Fahrassistent',
      'Prototyp einer Fahrer-App zur Generierung von GTFS-RT Feeds'
    ],
    stack: ['Vue', 'Nuxt', 'React', 'Flutter', 'React Native', 'Supabase', 'AWS Amplify', 'Node.js', 'Three.js', 'PostgreSQL', 'Unity', 'ARKit/ARCore', 'Photoshop']
  },
  {
    role: 'Full-Stack Entwickler',
    company: 'Freelance',
    time: '11/2019 – 02/2020',
    bullets: [
      'Mitgliedsverwaltung für Stocksportverein OÖ',
      'Für 15.000 Mitglieder und Scheckkarten System',
      'Projekt wurde aufgrund der Corona-Pandemie in der Entwicklungsphase beendet'],
    stack: ['Angular', 'Spring Boot', 'Bootstrap', 'MySQL']
  },
  {
    role: 'Unity Entwickler',
    company: 'NeNe Corp. (Japan)',
    time: '04/2019 – 07/2019',
    bullets: ['Face-Tracking auf 3D-Modell in Echtzeit'],
    stack: ['Unity', 'C#', 'C++']
  },
  {
    role: 'Unity Entwickler & 3D Artist',
    company: 'Enova GmbH · Plasser & Theurer',
    time: '08/2016 – 11/2018',
    bullets: [
      'Trainings-Simulator für Stopfmaschinen',
      'Mobile Game „Tamping Game“ (Android/iOS)',
      'VR-Konfigurator für Stopfmaschinen'

    ],
    stack: ['Unity', 'C#', 'Blender', 'Photoshop'],
  },
  {
    role: 'Software Entwickler',
    company: 'Objectbay GmbH · Raiffeisenbank Salzburg',
    time: '11/2014 – 11/2015',
    bullets: [
      'Neuentwicklung eines CRM',
      'CI/CD und Layout-Verantwortung'
    ],
    stack: ['AngularJS', 'JSF', 'Java', 'MySQL', 'Jenkins', 'Scrum']
  },
  {
    role: 'Software Entwickler',
    company: 'Case Softwaretechnik GmbH',
    time: '04/2013 – 10/2014',
    bullets: ['Zeiterfassungssysteme, Installation, Support, Wartung'],
    stack: ['jQuery', 'Python', 'PostgreSQL', 'Linux']
  },

  {
    role: 'Zivildienst & Übergangsjobs',
    company: 'Diverse Arbeitgeber · Oberösterreich',
    time: '07/2011 – 03/2013',
    bullets: [
      'Zivildienst im Landeskrankenhaus Steyr (02/2012 – 10/2012)',
      'Verschiedene Übergangstätigkeiten bis zum Zivildienst: Produktion, Elektroinstallation, Logistik und Maschinenbedienung',
      'Arbeitgeber u. a.: Biodiesel Enns, VÖST Linz, Agru Bad Hall, BMW Steyr',
    ],
    stack: []
  }
]
</script>
