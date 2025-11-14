<template>
  <main class="min-h-screen bg-[#0B1220] text-slate-200">

    <section class="relative bg-center bg-cover" style="background-image:url('/hero-bg.svg')">
      <div class="mx-auto max-w-6xl px-6 pt-28 pb-10">
        <div class="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl"> Alle Projekte</h1>
        </div>

        <p class="mt-3 text-slate-400">Chronologisch sortiert, inklusive älterer Projekte, Freelance- und Hobby-Arbeiten.</p>
      </div>
    </section>


    <section class="mx-auto max-w-6xl px-6 pb-20">
      <div class="mt-6 grid gap-8 md:grid-cols-2">
        <article
            v-for="p in sorted"
            :key="p.title"
            class="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 ring-1 ring-white/5 transition hover:-translate-y-0.5 hover:ring-white/20"
        >
          <div class="aspect-[16/9] w-full overflow-hidden">
            <img
                :alt="p.title"
                :src="p.image"
                class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>

          <div class="flex flex-1 flex-col p-5">
            <div class="flex items-center justify-between text-xs text-slate-400">
              <span>{{ fmt(p.date) }}</span>
              <span
                  v-if="p.type"
                  class="rounded-full bg-white/5 px-2 py-0.5 ring-1 ring-white/10"
              >
            {{ p.type }}
          </span>
            </div>

            <h3 class="mt-2 text-lg font-semibold text-white">
              {{ p.title }}
            </h3>

            <div class="mt-2 flex-1">
              <p class="line-clamp-3 text-sm leading-relaxed text-slate-300">
                {{ p.description }}
              </p>
              <div class="mt-3 flex flex-wrap gap-2">
            <span
                v-for="t in p.stack"
                :key="t"
                class="rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-slate-300 ring-1 ring-white/10"
            >
              {{ t }}
            </span>
              </div>
            </div>

            <div class="mt-4 flex flex-wrap gap-2">
              <a
                  v-if="p.website"
                  :href="p.website"
                  class="inline-flex items-center gap-1 rounded-xl bg-white/10 px-3.5 py-2 text-sm font-semibold text-white ring-1 ring-white/15 hover:bg-white/15"
                  rel="noopener"
                  target="_blank"
              >
                Website
                <Icon name="lucide:arrow-up-right" size="16"/>
              </a>

              <a
                  v-if="p.github"
                  :href="p.github"
                  class="inline-flex items-center gap-1 rounded-xl bg-white/5 px-3.5 py-2 text-sm font-semibold text-slate-200 ring-1 ring-white/10 hover:bg-white/10"
                  rel="noopener"
                  target="_blank"
              >
                GitHub
                <Icon name="simple-icons:github" size="16"/>
              </a>

              <NuxtLink
                  v-if="p.details"
                  :to="p.details"
                  class="inline-flex items-center gap-1 rounded-xl bg-sky-400 px-3.5 py-2 text-sm font-semibold text-slate-900 ring-1 ring-sky-300/60 shadow-sm shadow-sky-500/40 transition hover:bg-sky-300 hover:ring-sky-200"
              >
                Mehr erfahren
                <Icon name="lucide:arrow-up-right" size="16"/>
              </NuxtLink>
            </div>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<script lang="ts" setup>
type Project = {
  title: string
  description: string
  image: string
  date: string
  stack: string[]
  type?: string
  website?: string
  github?: string
  details?: string
}

const projects: Project[] = [
  {
    title: 'MoneyKoi',
    description: 'Budget-Book mit Offline-First Sync, polierter UX und Supabase-Backend.',
    image: '/images/moneykoi2.png',
    date: '2025-10-01',
    stack: ['Flutter', 'Supabase', 'PostgreSQL', 'Edge Functions', 'Sentry', 'Offline-First'],
    website: 'https://moneykoi.app',
    github: 'https://github.com/GeraldGmainer/moneykoi',
    type: 'Privat',
    details: '/project/moneykoi'
  },
  {
    title: 'Regelwerks- & Schadenmanagement',
    description: 'Module für einen Versicherungsverbund: Regelwerke, Prozesse, Auswertungen.',
    image: '/images/ww.png',
    date: '2024-06-15',
    stack: ['Angular', 'Spring Boot', 'PostgreSQL'],
    type: 'Beruf'
  },
  {
    title: 'Rodelbahn Admin & App',
    description: 'Buchungen, Scans und Betriebsübersicht für Sommerrodelbahnen.',
    image: '/images/sunkid.png',
    date: '2024-08-20',
    stack: ['Angular', 'Spring Boot', 'PostgreSQL', 'Keycloak'],
    website: 'https://www.bruckschloegl.at/produkte/rodelbahn/',
    type: 'Beruf'
  },
  {
    title: 'Security-Software Backend Modernisierung',
    description: 'Refactoring und Architektur-Update für einen Security-Software-Anbieter.',
    image: '/images/seqify.png',
    date: '2024-07-01',
    stack: ['Spring Boot', 'Java', 'Kotlin', 'Docker', 'Kubernetes'],
    website: 'https://www.seqify.net/en/',
    type: 'Beruf'
  },
  {
    title: 'Materialwirtschaft & Logistik',
    description: 'Weiterentwicklung der hauseigenen ERP-Module.',
    image: 'https://picsum.photos/seed/aescudata/1200/800',
    date: '2024-03-15',
    stack: ['Angular', 'Java', 'Spring Boot'],
    type: 'Beruf'
  },
  {
    title: 'Transit Driver RT',
    description: 'Prototyp einer Fahrer-App zur Generierung von GTFS-RT Feeds inkl. Routenwahl und Hintergrund-Tracking.',
    image: '/images/transit-driver.png',
    date: '2025-03-01',
    stack: ['Flutter', 'Maps', 'Background Tracking', 'GTFS-RT', 'Supabase'],
    type: 'Prototyp'
  },
  {
    title: 'Schneepflugdienst Plattform',
    description: 'Dispo-App und Admin-Web für kommunalen Winterdienst.',
    image: 'https://picsum.photos/seed/snow/1200/800',
    date: '2021-12-01',
    stack: ['Flutter', 'Vue', 'Supabase'],
    type: 'Beruf'
  },
  {
    title: 'D-Drive Fahrassistenz',
    description: 'App und Admin-Web für Fahrunterstützungsdienst.',
    image: '/images/ddrive.png',
    date: '2022-06-01',
    stack: ['Flutter', 'Vue', 'Supabase'],
    type: 'Beruf',
    website: 'https://www.ubiteq.co.jp/service_product/d-drive-1',
    details: '/project/ddrive'
  },
  {
    title: 'Aizuwakamatsu Reiseführer',
    description: 'Tourismus-App für Sehenswürdigkeiten und Routen.',
    image: '/images/kokontabicho.png',
    date: '2021-06-01',
    stack: ['Flutter'],
    website: 'https://apps.apple.com/us/app/%E4%BC%9A%E6%B4%A5%E5%8F%A4%E4%BB%8A%E6%97%85%E5%B8%B3/id612672378',
    type: 'Beruf'
  },
  {
    title: 'AR/VR Experimente',
    description: 'Kleine AR/VR Demos und Prototypen mit HoloLens, Meta Quest & HTC Vive.',
    image: '/images/arvr.png',
    date: '2020-08-01',
    stack: ['Unity', 'ARKit/ARCore'],
    type: 'Beruf'
  },
  {
    title: 'Raraya 3D Rucksack-Konfigurator',
    description: 'Web-3D Konfigurator für japanische Schulrucksäcke.',
    image: '/images/raraya_desktop.png',
    date: '2023-05-01',
    stack: ['Three.js', 'Vue', 'PostProcessing'],
    website: 'https://sim.raraya.co.jp/',
    type: 'Beruf',
    details: '/project/raraya'
  },
  {
    title: 'Stocksport Mitgliederverwaltung',
    description: 'Freelance-Projekt für 15.000 Mitglieder, Scheckkarten-System.',
    image: '/images/stocksport.png',
    date: '2019-11-01',
    stack: ['Angular', 'Spring', 'MySQL', 'Tomcat', 'Bootstrap'],
    type: 'Freelance'
  },
  {
    title: 'Face-Tracking App',
    description: 'Gesichts- und Kopftracking auf 3D-Modell in Echtzeit.',
    image: '/images/face.png',
    date: '2019-05-01',
    stack: ['Unity', 'C#', 'C++', 'DLIB'],
    type: 'Beruf'
  },
  {
    title: 'Tamping Game',
    description: 'Mobile Game rund um Stopfmaschinen, Veröffentlichung im Play Store.',
    image: '/images/tampinggame.png',
    date: '2018-07-01',
    stack: ['Unity', 'C#', 'Android', 'iOS'],
    website: 'https://play.google.com/store/apps/details?id=com.plassertheurer.tampinggame&hl=de_AT',
    type: 'Beruf'
  },
  {
    title: 'Simulator für Gleisstopfmaschinen',
    description: 'Trainings-Simulator inkl. SPS-Kommunikation und 3D-Modellierung.',
    image: '/images/tampingsim.png',
    date: '2017-08-01',
    stack: ['Unity', 'C#', 'Blender', 'Photoshop'],
    website: 'https://www.plassertheurer.com/de/fleet/support-and-training/3d-simulationstools/',
    type: 'Beruf'
  },
  {
    title: 'CRM Raiffeisenbank Salzburg',
    description: 'Neuentwicklung eines CRM im Scrum-Team, CI/CD und Layout-Verantwortung.',
    image: 'images/crm.png',
    date: '2015-06-01',
    stack: ['JSF', 'Java CDI', 'MySQL', 'Jenkins'],
    type: 'Beruf'
  },
  {
    title: 'Zeiterfassungstool',
    description: 'Interne Zeiterfassung mit Berichten.',
    image: 'images/timerecording.png',
    date: '2015-06-01',
    stack: ['AngularJS', 'Java CDI', 'PostgreSQL', 'Jenkins'],
    type: 'Beruf'
  },
  {
    title: 'CaseTIME Zeiterfassung',
    description: 'Features, Installation, Support und Wartung kundenspezifischer Zeiterfassung.',
    image: '/images/casetime.png',
    date: '2014-06-01',
    stack: ['jQuery', 'Python', 'PostgreSQL', 'Linux'],
    website: 'https://www.case.at/start/',
    type: 'Beruf'
  }
]

const sorted = computed(() =>
    [...projects].sort((a, b) => +new Date(b.date) - +new Date(a.date))
)

function fmt(d: string) {
  return new Date(d).toLocaleDateString('de-AT', {year: 'numeric', month: 'short'})
}
</script>
