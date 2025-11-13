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
          <a class="group inline-flex items-center gap-2 rounded-2xl bg-white text-slate-900 px-5 py-3 text-sm font-semibold shadow-lg shadow-blue-500/20 ring-1 ring-white/20 transition hover:translate-y-[-1px]"
             href="#projects">
            Projekte ansehen
            <span class="transition group-hover:translate-x-0.5">↗</span>
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

        <!-- 2 Karten pro Reihe (md), 1 Karte pro Reihe (mobil) -->
        <div class="mt-12 grid gap-6 md:grid-cols-2">
          <!-- Frontend -->
          <div class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm shadow-blue-500/10">
            <div
                class="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-300">
              🧩
            </div>
            <h3 class="text-lg font-semibold text-white">Frontend</h3>
            <div class="mt-4 space-y-4">
              <div v-for="s in skills.frontend" :key="s.label" class="space-y-2">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-slate-300">{{ s.label }}</span>
                  <span class="text-slate-400">{{ s.value }}%</span>
                </div>
                <div class="h-2 w-full rounded-full bg-white/10">
                  <div :style="{ width: s.value + '%' }"
                       class="h-2 rounded-full bg-gradient-to-r from-blue-400 via-cyan-300 to-sky-400"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Backend -->
          <div class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm shadow-cyan-500/10">
            <div
                class="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-300">
              🖥️
            </div>
            <h3 class="text-lg font-semibold text-white">Backend &amp; CI/CD</h3>
            <div class="mt-4 space-y-4">
              <div v-for="s in skills.backend" :key="s.label" class="space-y-2">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-slate-300">{{ s.label }}</span>
                  <span class="text-slate-400">{{ s.value }}%</span>
                </div>
                <div class="h-2 w-full rounded-full bg-white/10">
                  <div :style="{ width: s.value + '%' }"
                       class="h-2 rounded-full bg-gradient-to-r from-blue-400 via-cyan-300 to-sky-400"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- App -->
          <div class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm shadow-sky-500/10">
            <div class="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/20 text-sky-300">
              📱
            </div>
            <h3 class="text-lg font-semibold text-white">App-Entwicklung</h3>
            <div class="mt-4 space-y-4">
              <div v-for="s in skills.app" :key="s.label" class="space-y-2">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-slate-300">{{ s.label }}</span>
                  <span class="text-slate-400">{{ s.value }}%</span>
                </div>
                <div class="h-2 w-full rounded-full bg-white/10">
                  <div :style="{ width: s.value + '%' }"
                       class="h-2 rounded-full bg-gradient-to-r from-blue-400 via-cyan-300 to-sky-400"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 3D -->
          <div class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-sm shadow-indigo-500/10">
            <div
                class="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-300">
              🚀
            </div>
            <h3 class="text-lg font-semibold text-white">3D &amp; Echtzeit</h3>
            <div class="mt-4 space-y-4">
              <div v-for="s in skills.threeD" :key="s.label" class="space-y-2">
                <div class="flex items-center justify-between text-sm">
                  <span class="text-slate-300">{{ s.label }}</span>
                  <span class="text-slate-400">{{ s.value }}%</span>
                </div>
                <div class="h-2 w-full rounded-full bg-white/10">
                  <div :style="{ width: s.value + '%' }"
                       class="h-2 rounded-full bg-gradient-to-r from-blue-400 via-cyan-300 to-sky-400"></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>


    <section id="projects" class="bg-[#0B1220] py-24 sm:py-28">
      <div class="mx-auto max-w-6xl px-6">
        <h2 class="text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">Projekt-Highlights</h2>
        <div class="mt-12 grid gap-6 md:grid-cols-3">
          <NuxtLink v-for="p in projects" :key="p.title" :to="p.link"
                    class="group block overflow-hidden rounded-3xl border border-white/10 bg-white/5 ring-1 ring-white/5 transition hover:-translate-y-0.5 hover:ring-white/20">
            <div class="aspect-[4/3] w-full overflow-hidden">
              <img :src="p.image" alt=""
                   class="h-full w-full object-cover transition duration-500 group-hover:scale-105"/>
            </div>
            <div class="p-5">
              <span
                  class="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-300 ring-1 ring-white/10">{{
                  p.tag
                }}</span>
              <h3 class="mt-3 text-lg font-semibold text-white">{{ p.title }}</h3>
              <p class="mt-2 text-sm leading-relaxed text-slate-300">{{ p.blurb }}</p>
              <div class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white">
                <span>Mehr erfahren</span><span>↗</span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section id="capabilities" class="border-t border-white/5 bg-[#0D1424] py-24 sm:py-28">
      <div class="mx-auto max-w-6xl px-6">
        <h2 class="text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">Moderne
          Web-Fähigkeiten</h2>
        <div class="mt-12 grid gap-6 md:grid-cols-3">
          <div v-for="c in capabilities" :key="c.title"
               class="rounded-3xl border border-white/10 bg-[#0B1220] p-6 shadow-sm ring-1 ring-white/5">
            <div class="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-lg">{{
                c.icon
              }}
            </div>
            <h3 class="text-lg font-semibold text-white">{{ c.title }}</h3>
            <ul class="mt-3 space-y-1 text-sm text-slate-300">
              <li v-for="item in c.items" :key="item">{{ item }}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
const skills = {
  frontend: [
    {label: 'TypeScript / JavaScript', value: 92},
    {label: 'Angular', value: 90},
    {label: 'React', value: 88},
    {label: 'Next.js', value: 88},
    {label: 'Vue ', value: 86},
    {label: 'Nuxt', value: 86},
    {label: 'React Admin / Refine', value: 80},
    {label: 'Bootstrap / Material Design', value: 80},
    {label: 'Tailwind', value: 80},

  ],
  backend: [
    {label: 'Java / Kotlin', value: 88},
    {label: 'Spring Boot / Hibernate / CDI', value: 86},
    {label: 'Node.js', value: 80},
    {label: 'REST / GraphQL', value: 80},
    {label: 'PostgreSQL', value: 84},
    {label: 'MySQL / Oracle SQL', value: 32},
    {label: 'Supabase', value: 82},
    {label: 'Keycloak', value: 78},
    {label: 'Docker / Kubernetes', value: 78},
  ],
  app: [
    {label: 'Flutter (inkl. BloC)', value: 90},
    {label: 'Native Android (Kotlin/Java/Jetpack)', value: 82},
    {label: 'Swift / iOS Basics', value: 70},
    {label: 'Lokaler Cache & Sync (Offline-First)', value: 86},
    {label: 'Publizieren (Android & iOS)', value: 82},
    {label: 'Android Studio / Tooling', value: 85},
    {label: 'Bluetooth (BLE/Classic)', value: 78},
    {label: 'Karten & Geolocation (OSM/MapLibre/Google)', value: 82},
    {label: 'UI Design & Typografie', value: 60},
  ],
  threeD: [
    {label: 'Unity', value: 88},
    {label: 'C#', value: 88},
    {label: 'Unreal Engine 4', value: 42},
    {label: 'C++', value: 42},
    {label: 'Three.js / WebGL', value: 78},
    {label: 'Modelling / Rigging / Animation', value: 82},
    {label: 'Texturing / Rendering', value: 78},
    {label: 'Game Design', value: 72},
    {label: 'Blender / Photoshop / Gimp', value: 80},
    {label: 'Maya / 3ds Max (Basis)', value: 60},
  ]
}

const projects = [
  {
    title: 'Atlas Budget',
    blurb: 'Offline-first-Budget-App mit Sync und Insights.',
    link: '/projects/atlas-budget',
    image: 'https://picsum.photos/seed/a/800/600',
    tag: 'Flutter'
  },
  {
    title: 'Nebula 3D',
    blurb: 'Prozedurale Weltraumszene mit Post-Processing und Shadern.',
    link: '/projects/nebula-3d',
    image: 'https://picsum.photos/seed/b/800/600',
    tag: 'Three.js'
  },
  {
    title: 'Pulse Dashboard',
    blurb: 'Full-Stack-Analytics mit Live-Updates und Auth.',
    link: '/projects/pulse-dashboard',
    image: 'https://picsum.photos/seed/c/800/600',
    tag: 'TypeScript'
  }
]

const capabilities = [
  {icon: '🎮', title: 'WebGL & 3D', items: ['Three.js', 'WebGL-Shader', 'Performance-Optimierung']},
  {icon: '📲', title: 'Progressive Web-Apps', items: ['Offline-Support', 'Push-Benachrichtigungen', 'App-ähnliche UX']},
  {icon: '⚡', title: 'Echtzeit', items: ['WebSockets', 'WebRTC', 'Server-Sent Events']},
  {icon: '🧰', title: 'Browser-APIs', items: ['Dateisystemzugriff', 'Worker', 'Service Worker']},
  {icon: '🚀', title: 'Performance', items: ['Code-Splitting', 'Tree-Shaking', 'Ressourcen-Optimierung']},
  {icon: '🔒', title: 'Sicherheit', items: ['CSP', 'CORS-Konfiguration', 'Security-Header']}
]
</script>
