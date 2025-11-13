<template>
  <main class="min-h-screen bg-[#0B1220] text-slate-200">
    <section class="relative bg-center bg-cover" style="background-image:url('/hero-bg.svg')">
      <div class="mx-auto max-w-6xl px-6 pt-28 pb-12">
        <h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl">Projekte</h1>
        <p class="mt-3 text-slate-400">Alle Arbeiten, nach Datum sortiert</p>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-6 pb-20">
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <article v-for="p in sorted" :key="p.title" class="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 ring-1 ring-white/5 transition hover:-translate-y-0.5 hover:ring-white/20">
          <div class="aspect-[16/10] w-full overflow-hidden">
            <img :src="p.image" :alt="p.title" class="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          </div>
          <div class="p-5">
            <div class="flex items-center justify-between text-xs text-slate-400">
              <span>{{ fmt(p.date) }}</span>
              <span v-if="p.type" class="rounded-full bg-white/5 px-2 py-0.5 ring-1 ring-white/10">{{ p.type }}</span>
            </div>
            <h3 class="mt-2 text-lg font-semibold text-white">{{ p.title }}</h3>
            <p class="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-300">{{ p.description }}</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <span v-for="t in p.stack" :key="t" class="rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-slate-300 ring-1 ring-white/10">{{ t }}</span>
            </div>
            <div class="mt-4 flex flex-wrap gap-2">
              <a v-if="p.website" :href="p.website" target="_blank" rel="noopener" class="inline-flex items-center rounded-xl bg-white text-slate-900 px-3.5 py-2 text-sm font-semibold ring-1 ring-white/20">Website ↗</a>
              <a v-if="p.github" :href="p.github" target="_blank" rel="noopener" class="inline-flex items-center rounded-xl bg-white/10 px-3.5 py-2 text-sm font-semibold text-white ring-1 ring-white/15 hover:bg-white/15">GitHub ↗</a>
            </div>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
type Project = {
  title: string
  description: string
  image: string
  date: string
  stack: string[]
  type?: string
  website?: string
  github?: string
}

const projects: Project[] = [
  {
    title: 'MoneyKoi',
    description: 'Budget-Book mit Offline-First Sync, polierter UX und Supabase-Backend.',
    image: 'https://picsum.photos/seed/moneykoi/1200/800',
    date: '2025-10-01',
    stack: ['Flutter','Supabase','PostgreSQL','Edge Functions','Sentry','Offline-First'],
    website: 'https://moneykoi.app',
    github: 'https://github.com/GeraldGmainer/moneykoi',
    type: 'Privat'
  },
  {
    title: 'Transit Driver RT',
    description: 'Prototyp einer Fahrer-App zur Generierung von GTFS-RT Feeds inkl. Routenwahl und Hintergrund-Tracking.',
    image: 'https://picsum.photos/seed/gtfsrt/1200/800',
    date: '2025-03-01',
    stack: ['Flutter','Maps','Background Tracking','GTFS-RT','Supabase'],
    type: 'Prototyp'
  },
  {
    title: 'Rodelbahn Admin & App',
    description: 'Buchungen, Scans und Betriebsübersicht für Sommerrodelbahnen.',
    image: 'https://picsum.photos/seed/rodel/1200/800',
    date: '2024-08-20',
    stack: ['Angular','Spring Boot','PostgreSQL','Keycloak'],
    type: 'Beruf'
  },
  {
    title: 'Security-Software Backend Modernisierung',
    description: 'Refactoring und Architektur-Update für einen Security-Software-Anbieter.',
    image: 'https://picsum.photos/seed/security/1200/800',
    date: '2024-07-01',
    stack: ['Spring Boot','Java','Docker'],
    type: 'Beruf'
  },
  {
    title: 'Regelwerks- & Schadenmanagement',
    description: 'Module für einen Versicherungsverbund: Regelwerke, Prozesse, Auswertungen.',
    image: 'https://picsum.photos/seed/insurance/1200/800',
    date: '2024-06-15',
    stack: ['Angular','Spring Boot','PostgreSQL'],
    type: 'Beruf'
  },
  {
    title: 'Materialwirtschaft & Logistik',
    description: 'Weiterentwicklung der hauseigenen ERP-Module.',
    image: 'https://picsum.photos/seed/aescudata/1200/800',
    date: '2024-03-15',
    stack: ['Angular','Java','Spring Boot'],
    type: 'Beruf'
  },
  {
    title: 'Raraya 3D Rucksack-Konfigurator',
    description: 'Web-3D Konfigurator für Schulrucksäcke.',
    image: 'https://picsum.photos/seed/raraya/1200/800',
    date: '2023-05-01',
    stack: ['Three.js','Vue','PostProcessing'],
    website: 'https://sim.raraya.co.jp/',
    type: 'Beruf'
  },
  {
    title: 'D-Drive Fahrassistenz',
    description: 'App und Admin-Web für Fahrunterstützungsdienst.',
    image: 'https://picsum.photos/seed/ddrive/1200/800',
    date: '2022-06-01',
    stack: ['Flutter','Vue','Supabase'],
    type: 'Beruf'
  },
  {
    title: 'Schneepflugdienst Plattform',
    description: 'Dispo-App und Admin-Web für kommunalen Winterdienst.',
    image: 'https://picsum.photos/seed/snow/1200/800',
    date: '2021-12-01',
    stack: ['Flutter','Vue','Supabase'],
    type: 'Beruf'
  },
  {
    title: 'Aizuwakamatsu Reiseführer',
    description: 'Tourismus-App für Sehenswürdigkeiten und Routen.',
    image: 'https://picsum.photos/seed/aizu/1200/800',
    date: '2021-06-01',
    stack: ['Flutter','Supabase'],
    type: 'Beruf'
  },
  {
    title: 'AR/VR Experimente',
    description: 'Kleine AR/VR Demos und Prototypen.',
    image: 'https://picsum.photos/seed/arvr/1200/800',
    date: '2020-08-01',
    stack: ['Unity','ARKit/ARCore'],
    type: 'Experiment'
  },
  {
    title: 'Stocksport Mitgliederverwaltung',
    description: 'Freelance-Projekt für 15.000 Mitglieder, Scheckkarten-System.',
    image: 'https://picsum.photos/seed/stocksport/1200/800',
    date: '2019-11-01',
    stack: ['Angular','Spring','MySQL','Tomcat','Bootstrap'],
    type: 'Freelance'
  },
  {
    title: 'Face-Tracking App',
    description: 'Gesichts- und Kopftracking auf 3D-Modell in Echtzeit.',
    image: 'https://picsum.photos/seed/facetracking/1200/800',
    date: '2019-05-01',
    stack: ['Unity','C#','C++','DLIB'],
    type: 'Beruf'
  },
  {
    title: 'Tamping Game',
    description: 'Mobile Game rund um Stopfmaschinen, Veröffentlichung im Play Store.',
    image: 'https://picsum.photos/seed/tamping/1200/800',
    date: '2018-07-01',
    stack: ['Unity','C#','Android','iOS'],
    website: 'https://play.google.com/store/apps/details?id=com.plassertheurer.tampinggame&hl=de_AT',
    type: 'Beruf'
  },
  {
    title: 'Simulator für Gleisstopfmaschinen',
    description: 'Trainings-Simulator inkl. SPS-Kommunikation und 3D-Modellierung.',
    image: 'https://picsum.photos/seed/simulator/1200/800',
    date: '2017-08-01',
    stack: ['Unity','C#','Blender','SPS'],
    type: 'Beruf'
  },
  {
    title: 'CRM Raiffeisenbank Salzburg',
    description: 'Neuentwicklung eines CRM im Scrum-Team, CI/CD und Layout-Verantwortung.',
    image: 'https://picsum.photos/seed/crm/1200/800',
    date: '2015-06-01',
    stack: ['AngularJS','JSF','Java','MySQL','Jenkins'],
    type: 'Beruf'
  },
  {
    title: 'Zeiterfassungssysteme',
    description: 'Features, Installation, Support und Wartung kundenspezifischer Zeiterfassung.',
    image: 'https://picsum.photos/seed/timetracking/1200/800',
    date: '2014-06-01',
    stack: ['jQuery','Python','PostgreSQL','Linux'],
    type: 'Beruf'
  }
]

const sorted = computed(() => {
  const list = [...projects].sort((a, b) => +new Date(b.date) - +new Date(a.date))
  const idx = list.findIndex(p => p.title === 'MoneyKoi')
  if (idx > 0) list.unshift(...list.splice(idx, 1))
  return list
})

function fmt(d: string) {
  return new Date(d).toLocaleDateString('de-AT', { year: 'numeric', month: 'short' })
}
</script>
