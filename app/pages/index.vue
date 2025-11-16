<template>
  <div>
    <section
        id="home"
        class="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-center bg-cover"
        style="background-image: url('/hero-bg.svg');"
    >
      <div class="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <p class="mx-auto inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-s font-medium text-slate-300 ring-1 ring-white/10 backdrop-blur">
          <span>Web · App · 3D</span>
        </p>
        <h1 class="mt-6 text-5xl font-extrabold tracking-tight text-white sm:text-8xl">
          <span class="neon bg-gradient-to-r from-blue-400 via-cyan-300 to-sky-400 bg-clip-text text-transparent">Gerald Gmainer</span>
        </h1>
        <p class="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
          Moderne Web-, App- & 3D-Lösungen aus einer Hand
        </p>
        <div class="mt-8 flex items-center justify-center gap-3">
          <a
              class="group inline-flex items-center gap-2 rounded-2xl bg-white text-slate-900 px-5 py-3 text-sm font-semibold shadow-lg shadow-blue-500/20 ring-1 ring-white/20 transition hover:translate-y-[-1px]"
              href="#projects"
          >
            Projekte ansehen
            <Icon
                class="transition group-hover:translate-x-0.5"
                name="lucide:arrow-up-right"
                size="16"
            />
          </a>
          <NuxtLink
              class="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/15 backdrop-blur transition hover:bg-white/15"
              to="/contact">
            Kontakt aufnehmen
          </NuxtLink>
        </div>
        <div class="mt-24 flex justify-center text-slate-400">
          <a class="inline-flex flex-col items-center text-xs" href="#skills">
            <span class="text-lg">Scrollen zum Entdecken</span>
            <Icon class="mt-2 animate-bounce text-slate-300" name="lucide:chevron-down" size="32"/>
          </a>
        </div>
      </div>
    </section>

    <section id="skills" class="border-t border-white/5 bg-[#0D1424] py-24 sm:py-28">
      <div class="mx-auto max-w-6xl px-6">
        <h2 class="text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">Technische Expertise</h2>
        <p class="mx-auto mt-3 max-w-2xl text-center text-sm text-slate-400 sm:text-base">
          Breiter Full-Stack-Background mit Schwerpunkt auf moderne Web-, App- und 3D-Stacks.
        </p>

        <div class="mt-8 flex justify-center sm:justify-center">
          <div class="flex gap-2 overflow-x-auto rounded-full bg-white/5 p-2 text-xs sm:inline-flex sm:flex-wrap sm:justify-center sm:text-sm scrollbar-hide">
            <button
                v-for="tab in skillTabs"
                :key="tab.key"
                :class="activeSkillTab === tab.key
            ? 'bg-white text-slate-900 shadow-sm shadow-sky-500/40'
            : 'text-slate-300 hover:bg-white/5 hover:text-white'"
                class="whitespace-nowrap rounded-full px-4 py-1.5 transition inline-flex items-center gap-2"
                type="button"
                @click="activeSkillTab = tab.key"
            >
              <span class="text-base">{{ tab.icon }}</span>
              <span>{{ tab.label }}</span>
            </button>
          </div>
        </div>

        <div class="mt-10 mx-auto max-w-2xl">
          <div class="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-sky-500/10 p-6 shadow-sm shadow-sky-500/20">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {{ activeSkillTabLabel }}
                </p>
                <h3 class="mt-2 text-xl font-semibold text-white">
                  {{ activeSkillHeadline }}
                </h3>
              </div>
              <div class="self-start rounded-2xl bg-black/40 px-3 py-2 text-right text-xs text-slate-300">
                <p class="mt-0.5 text-[11px] text-sky-200">Ø {{ averageSkillValue }}%</p>
              </div>
            </div>

            <div class="mt-6 space-y-4">
              <div
                  v-for="skill in currentSkills"
                  :key="skill.label"
                  class="rounded-2xl bg-black/30 px-4 py-3 ring-1 ring-white/5"
              >
                <div class="flex items-center justify-between text-xs sm:text-sm">
                  <span class="font-medium text-slate-100">{{ skill.label }}</span>
                  <span class="tabular-nums text-slate-300">{{ skill.value }}%</span>
                </div>
                <div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                      :style="{ width: skill.value + '%' }"
                      class="h-full rounded-full bg-gradient-to-r from-blue-400 via-cyan-300 to-sky-400 shadow-[0_0_14px_rgba(56,189,248,0.6)]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-20 flex justify-center">
        <NuxtLink
            class="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/15 backdrop-blur transition hover:bg-white/15"
            to="/about"
        >
          Über mich
          <Icon name="lucide:arrow-up-right" size="16"/>
        </NuxtLink>
      </div>
    </section>


    <section id="projects" class="border-t border-white/5 bg-[#050816] py-24 sm:py-28">
      <div class="mx-auto max-w-6xl px-6">
        <h2 class="text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">Projekt-Highlights</h2>

        <div class="mt-12 grid gap-6 md:grid-cols-3">
          <div
              v-for="project in featuredProjects"
              :key="project.title"
              class="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 ring-1 ring-white/5 transition hover:-translate-y-0.5 hover:ring-white/20"
          >
            <div
                class="flex items-center justify-center h-[420px] sm:h-[680px] w-full bg-gradient-to-br from-[#1F130F] via-[#050816] to-[#020617]"
            >
              <img
                  :alt="project.title"
                  :src="project.image"
                  class="max-h-full w-auto p-4 drop-shadow-2xl transition duration-500 group-hover:-translate-y-0.5"
              />
            </div>

            <div class="flex flex-1 flex-col p-5 pt-3">
              <div class="flex flex-wrap gap-2 text-xs">
              <span
                  v-for="tag in project.tags"
                  :key="tag"
                  class="inline-flex items-center rounded-full bg-white/10 px-3 py-1 font-medium text-slate-300 ring-1 ring-white/10">
                {{ tag }}
              </span>
              </div>
              <h3 class="mt-3 text-lg font-semibold text-white">
                {{ project.title }}
              </h3>
              <p class="mt-2 text-sm leading-relaxed text-slate-300">
                {{ project.blurb }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-20 flex justify-center">
        <NuxtLink
            class="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/15 backdrop-blur transition hover:bg-white/15"
            to="/projects"
        >
          Alle Projekte ansehen
          <Icon name="lucide:arrow-up-right" size="16"/>
        </NuxtLink>
      </div>
    </section>


    <section id="capabilities" class="border-t border-white/5 bg-[#050816] py-24 sm:py-28">
      <div class="mx-auto max-w-6xl px-6">
        <h2 class="text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">Was ich in Projekte einbringe</h2>
        <p class="mx-auto mt-3 max-w-2xl text-center text-sm text-slate-400 sm:text-base"> Von der ersten Idee bis zum
          Deployment: Full-Stack-Umsetzung mit Fokus auf UX, robuste Architektur und eine pragmatische Developer
          Experience. </p>
        <div class="mt-12 grid gap-6 md:grid-cols-3">
          <div v-for="c in capabilities" :key="c.title"
               class="rounded-3xl border border-white/10 bg-gradient-to-b from-[#0B1220] to-[#020617] p-6 shadow-sm shadow-slate-900/60 ring-1 ring-white/5 transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-500/30 hover:border-sky-400/60 hover:ring-sky-400/50">
            <div class="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-lg">
              {{ c.icon }}
            </div>
            <h3 class="text-lg font-semibold text-white"> {{ c.title }} </h3>
            <p v-if="c.subtitle" class="mt-1 text-xs uppercase tracking-[0.18em] text-slate-500"> {{ c.subtitle }} </p>
            <ul class="mt-4 space-y-1.5 text-sm text-slate-300">
              <li v-for="item in c.items" :key="item" class="flex gap-2"><span
                  class="mt-[6px] inline-block h-1.5 w-1.5 rounded-full bg-sky-400"></span> <span>{{ item }}</span></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue'

const skillTabs = [
  {
    key: 'frontend',
    label: 'Frontend',
    icon: '🧩',
    headline: 'Moderne Frontends mit Fokus auf UX',
  },
  {
    key: 'backend',
    label: 'Backend & CI/CD',
    icon: '🖥️',
    headline: 'Stabile Backends und saubere Pipelines',
  },
  {
    key: 'app',
    label: 'App-Entwicklung',
    icon: '📱',
    headline: 'Mobile Apps für iOS und Android',
  },
  {
    key: 'threeD',
    label: '3D & Game Dev',
    icon: '🚀',
    headline: 'Echtzeitgrafik und interaktive Experiences',
  }
] as const

type SkillTabKey = (typeof skillTabs)[number]['key']

const activeSkillTab = ref<SkillTabKey>('frontend')

const skills = {
  frontend: [
    {label: 'TypeScript / JavaScript', value: 86},
    {label: 'Angular', value: 88},
    {label: 'React', value: 82},
    {label: 'Next.js', value: 70},
    {label: 'Vue', value: 85},
    {label: 'Nuxt', value: 64},
    {label: 'React Admin / Refine', value: 92},
    {label: 'Bootstrap / Material Design', value: 90},
    {label: 'Tailwind', value: 71}
  ],
  backend: [
    {label: 'Java / Kotlin', value: 74},
    {label: 'Spring Boot / Hibernate / CDI', value: 72},
    {label: 'Node.js', value: 68},
    {label: 'REST / GraphQL', value: 82},
    {label: 'PostgreSQL', value: 95},
    {label: 'MySQL / Oracle SQL', value: 38},
    {label: 'Supabase', value: 95},
    {label: 'Keycloak', value: 48},
    {label: 'Docker / Kubernetes', value: 42}
  ],
  app: [
    {label: 'Flutter (inkl. BloC)', value: 96},
    {label: 'Native Android (Kotlin/Java/Jetpack)', value: 52},
    {label: 'Swift / iOS Basics', value: 25},
    {label: 'React Native', value: 45},
    {label: 'Lokaler Cache & Sync (Offline-First)', value: 88},
    {label: 'Publizieren (Android & iOS)', value: 84},
    {label: 'Android Studio / Tooling', value: 86},
    {label: 'Bluetooth (BLE/Classic)', value: 95},
    {label: 'Karten & Geolocation (OSM/MapLibre/Google)', value: 84},
    {label: 'UI Design & Typografie', value: 78}
  ],
  threeD: [
    {label: 'Unity', value: 86},
    {label: 'C#', value: 84},
    {label: 'Unreal Engine 4', value: 28},
    {label: 'C++', value: 32},
    {label: 'Three.js / WebGL', value: 90},
    {label: 'Modelling / Rigging / Animation', value: 82},
    {label: 'Texturing / Rendering', value: 80},
    {label: 'Game Design', value: 32},
    {label: 'Blender / Photoshop / Gimp', value: 78},
    {label: 'Maya / 3ds Max (Basis)', value: 38}
  ]
}

const currentSkills = computed(() => skills[activeSkillTab.value])

const averageSkillValue = computed(() => {
  if (!currentSkills.value.length) return 0
  const sum = currentSkills.value.reduce((acc, s) => acc + s.value, 0)
  return Math.round(sum / currentSkills.value.length)
})

const activeSkillMeta = computed(() => {
  return skillTabs.find(t => t.key === activeSkillTab.value) ?? skillTabs[0]
})

const activeSkillTabLabel = computed(() => activeSkillMeta.value.label)
const activeSkillHeadline = computed(() => activeSkillMeta.value.headline)

const featuredProjects = [
  {
    title: 'MoneyKoi – Haushaltsbuch-App',
    blurb: 'Flutter-App für Haushaltsbuchführung mit Supabase-Backend, Offline-First-Architektur und liebevoll gestalteter UI.',
    image: '/images/moneykoi.png',
    tags: ['Flutter', 'Next.js', 'Supabase'],
    layout: 'phone',
    scale: 0.9
  },
  {
    title: 'D-Drive – Fahrassistant & Admin',
    blurb: 'Telematik-App für Lkw- und Busfahrer mit Bluetooth-Alkoholmessung, GPS-Fahrtenaufzeichnung und Admin-Dashboard für Auswertungen.',
    image: '/images/ddrive.png',
    tags: ['Flutter', 'React Admin', 'Supabase'],
    scale: 1.1
  },
  {
    title: 'RARAYA – 3D Rucksack-Konfigurator',
    blurb: 'Interaktiver 3D-Konfigurator für Schulrucksäcke mit Vue und Three.js – Anpassung von Farben und Details in Echtzeit.',
    image: '/images/raraya.png',
    tags: ['Three.js', 'Vue', 'Node.js'],
    scale: 0.95
  }
]

const capabilities = [
  {
    icon: '📱',
    title: 'Mobile & Offline-First',
    subtitle: 'Flutter · Native · Stores',
    items: [
      'Flutter-Apps für iOS und Android',
      'Lokaler Cache & Sync mit Supabase/SQLite',
      'Release-Setup für Play Store & App Store'
    ]
  },
  {
    icon: '🖥️',
    title: 'Web & Admin-Dashboards',
    subtitle: 'Angular · React · Vue',
    items: [
      'Single-Page-Apps mit Angular, React oder Vue/Nuxt',
      'Admin-Backoffice mit React Admin / Refine',
      'UI-Systeme mit Tailwind, Material Design und eigenen Komponenten'
    ]
  },
  {
    icon: '🧱',
    title: 'APIs, Daten & Auth',
    subtitle: 'Spring Boot · Supabase · Keycloak',
    items: [
      'REST- und GraphQL-APIs mit Java/Kotlin oder Node.js',
      'PostgreSQL und Supabase inkl. RLS, Policies und Migrationsstrategie',
      'Auth mit JWT, OAuth2, OpenID Connect und Rollen/Rechten'
    ]
  },
  {
    icon: '🎮',
    title: '3D, Games & Simulation',
    subtitle: 'Unity · Three.js',
    items: [
      'Unity- und C#-Projekte für Training und Serious Games',
      'Three.js/WebGL-Experiences im Browser',
      'Pipeline von 3D-Modelling über Texturing bis zur Optimierung'
    ]
  },
  {
    icon: '📊',
    title: 'Daten, Dashboards & UX',
    subtitle: 'Analytics · Visualisierung',
    items: [
      'Übersichtliche Dashboards für Fachbereiche und Management',
      'Interaktive Charts, Filter und Reportings',
      'UX-Feinschliff mit Fokus auf Klarheit und Lesbarkeit'
    ]
  },
  {
    icon: '🚀',
    title: 'DevOps & Qualität',
    subtitle: 'CI/CD · Monitoring',
    items: [
      'Docker-basierte Umgebungen und Deployment-Pipelines',
      'CI/CD für Web- und Mobile-Projekte',
      'Monitoring und Fehlertracking mit Tools wie Sentry'
    ]
  }
]

</script>

<style>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
