<template>
  <main class="min-h-screen bg-[#0B1220] text-slate-200">
    <section class="relative bg-center bg-cover" style="background-image:url('/hero-bg.svg')">
      <div class="mx-auto max-w-6xl px-6 pt-28 pb-12">
        <div class="flex flex-col items-center text-center">
          <img alt="Gerald Gmainer"
               class="h-64 w-64 rounded-2xl ring-2 ring-white/15 shadow-lg shadow-blue-500/20 object-cover"
               src="/images/profile.png"/>
          <h1 class="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">Über mich</h1>
          <p class="mt-3 max-w-2xl text-slate-300">Full-Stack-Entwickler mit Fokus auf Flutter-Apps, moderne Web-Stacks
            und Echtzeit-3D. Ich baue performante Produkte mit sauberer Architektur, Offline-First und Liebe zum
            Detail.</p>
          <div class="mt-6 inline-flex flex-wrap justify-center gap-2">
            <span class="rounded-full bg-white/10 px-3 py-1 text-xs ring-1 ring-white/10">Garsten, Österreich · Remote/Hybrid</span>
            <span
                class="rounded-full bg-white/10 px-3 py-1 text-xs ring-1 ring-white/10">Deutsch · Englisch · Japanisch</span>
            <span class="rounded-full bg-white/10 px-3 py-1 text-xs ring-1 ring-white/10">Web · App · 3D</span>
            <span class="rounded-full bg-white/10 px-3 py-1 text-xs ring-1 ring-white/10">Hobby: Holzhandwerk</span>
          </div>
          <div class="mt-8 flex gap-3">
            <NuxtLink
                class="inline-flex items-center gap-2 rounded-2xl bg-white text-slate-900 px-5 py-3 text-sm font-semibold ring-1 ring-white/20"
                to="/resume">
              Lebenslauf
            </NuxtLink>
            <NuxtLink
                class="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/15 backdrop-blur hover:bg-white/15"
                to="/contact">
              Kontakt
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-6 py-12">
      <div class="grid gap-8 lg:grid-cols-2">
        <div class="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 class="text-xl font-semibold">Kurzprofil</h2>
          <ul class="mt-4 space-y-3 text-s text-slate-300">
            <li class="flex gap-2"><span class="text-cyan-400">•</span><span>End-to-end Entwicklung: Konzeption, UI/UX, Architektur, Implementierung, Testing und Release.</span>
            </li>
            <li class="flex gap-2"><span class="text-cyan-400">•</span><span>Flutter-Apps mit lokalem Cache, konfliktarmem Sync und sauberen State-Patterns.</span>
            </li>
            <li class="flex gap-2"><span class="text-cyan-400">•</span><span>Web mit TypeScript, moderne Frameworks, sichere APIs und Datenmodelle.</span>
            </li>
            <li class="flex gap-2"><span class="text-cyan-400">•</span><span>3D/Realtime: Unity, Three.js/WebGL, Performance-Optimierung und Tooling.</span>
            </li>
          </ul>
        </div>

        <div class="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 class="text-xl font-semibold">Werte & Arbeitsweise</h2>
          <ul class="mt-4 space-y-3 text-s text-slate-300">
            <li class="flex gap-2">
              <span class="text-cyan-400">•</span>
              <span>Nutzerzentriert & ergebnisorientiert: klare Ziele, kurze Iterationen, messbare Wirkung (LCP, Crash-Rate, Conversion).</span>
            </li>
            <li class="flex gap-2">
              <span class="text-cyan-400">•</span>
              <span>Architektur & Code-Qualität: saubere Domänen, stabile APIs, starke Typisierung, Tests (Unit/E2E) und CI-Gates.</span>
            </li>
            <li class="flex gap-2">
              <span class="text-cyan-400">•</span>
              <span>Performance & Stabilität: Offline-First, Caching/Sync, Profiling, Observability (Logs/Metrics), Sentry/Crashlytics, Security-by-default (RLS, Least-Privilege).</span>
            </li>
            <li class="flex gap-2">
              <span class="text-cyan-400">•</span>
              <span>Zusammenarbeit & Ownership: transparente Kommunikation, gute Tickets/Docs, verlässliche Zusagen, respektvolle Reviews.</span>
            </li>
          </ul>


        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-6 pb-4">
      <!--      <div class="grid gap-6 sm:grid-cols-3">-->
      <!--        <img src="/images/about-1.jpg" alt="" class="h-64 w-full rounded-3xl object-cover ring-1 ring-white/10"/>-->
      <!--        <img src="/images/about-2.jpg" alt="" class="h-64 w-full rounded-3xl object-cover ring-1 ring-white/10"/>-->
      <!--        <img src="/images/about-3.jpg" alt="" class="h-64 w-full rounded-3xl object-cover ring-1 ring-white/10"/>-->
      <!--      </div>-->
    </section>

    <section class="mx-auto max-w-6xl px-6 py-12">
      <h2 class="text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">Skillset</h2>
      <p class="mt-2 text-center text-slate-400">Technologien, mit denen ich regelmäßig arbeite</p>

      <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h3 class="text-sm font-semibold text-white">Frontend</h3>
          <div class="mt-4 grid grid-cols-1 gap-2">
            <SkillChip v-for="t in skills.frontend" :key="t" :label="t" icon="brackets" tone="text-cyan-300"/>
          </div>
        </div>

        <div class="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h3 class="text-sm font-semibold text-white">Backend & CI/CD</h3>
          <div class="mt-4 grid grid-cols-1 gap-2">
            <SkillChip v-for="t in skills.backend" :key="t" :label="t" icon="server" tone="text-blue-300"/>
          </div>
        </div>

        <div class="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h3 class="text-sm font-semibold text-white">App</h3>
          <div class="mt-4 grid grid-cols-1 gap-2">
            <SkillChip v-for="t in skills.app" :key="t" :label="t" icon="phone" tone="text-sky-300"/>
          </div>
        </div>

        <div class="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h3 class="text-sm font-semibold text-white">3D</h3>
          <div class="mt-4 grid grid-cols-1 gap-2">
            <SkillChip v-for="t in skills.threeD" :key="t" :label="t" icon="cube" tone="text-indigo-300"/>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-6 pb-20">
      <h2 class="text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">Tools</h2>
      <p class="mt-2 text-center text-slate-400">Werkzeuge, die meinen Alltag schneller machen</p>
      <div class="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <div v-for="tool in tools" :key="tool"
             class="grid h-24 place-items-center rounded-2xl border border-white/10 bg-white/5 text-sm ring-1 ring-white/5">
          <span class="text-slate-200">{{ tool }}</span>
        </div>
      </div>
    </section>

    <section id="woodwork" class="mx-auto max-w-6xl px-6 pb-24">
      <h2 class="text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">Holzarbeiten</h2>
      <p class="mt-2 text-center text-slate-400">Kleines Nebenprojekt – echtes Handwerk</p>

      <div class="mt-10 grid gap-6 md:grid-cols-3">
        <figure v-for="w in woodProjects" :key="w.title"
                class="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 ring-1 ring-white/5 transition hover:-translate-y-0.5 hover:ring-white/20">
          <div class="aspect-[4/3] w-full overflow-hidden">
            <img :alt="w.title" :src="w.image"
                 class="h-full w-full object-cover transition duration-500 group-hover:scale-105"/>
          </div>
          <figcaption class="p-5">
            <h3 class="text-base font-semibold text-white">{{ w.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-slate-300">{{ w.blurb }}</p>
          </figcaption>
        </figure>
      </div>
    </section>
  </main>
</template>

<script lang="ts" setup>
import SkillChip from "~/components/SkillChip.vue";

const skills = {
  frontend: [
    'TypeScript', 'Angular', 'React', 'Vue', 'Nuxt', 'Next.js', 'Tailwind CSS',
    'Vite', 'Three.js/WebGL', 'Zustand/Redux/ngrx', 'Jest', 'Cypress', 'Accessibility'
  ],
  backend: [
    'Java', 'Spring Boot', 'Node.js', 'Express/Nest', 'GraphQL/REST', 'PostgreSQL',
    'Supabase (Auth, RLS, Edge Functions)', 'MySQL', 'Keycloak', 'Docker',
    'Kubernetes', 'NGINX', 'Git', 'GitHub Actions', 'Jenkins', 'Vercel', 'CI/CD', 'Monitoring/Logging'
  ],
  app: [
    'Flutter', 'Dart', 'Android/Kotlin', 'iOS/Swift', 'Offline-First', 'Background Tracking',
    'Maps/Geolocation', 'Push Notifications', 'Sentry/Crashlytics', 'Fastlane', 'FVM',
    'Localization/i18n', 'Store-Assets & Releases'
  ],
  threeD: [
    'Unity', 'C#', 'C++', 'Three.js', 'WebGL', 'Shader (HLSL/GLSL)', 'Post-Processing',
    'Physics/Animation', 'Optimization/Profiling', 'ARKit/ARCore', 'Blender', 'Photoshop'
  ]
}
const tools = [
  'Android Studio',
  'IntelliJ IDEA',
  'VS Code',
  'Figma',
  'Photoshop',
  'Blender',
  'Linux/Ubuntu',
  'Git',
  'GitHub',
  'Jenkins/CI',
  'Docker Desktop',
  'Postman',
  'Supabase Studio',
  'Xcode',
  'Fastlane'
]
const woodProjects = [
  {
    title: 'Schaukelpferd',
    image: 'https://picsum.photos/seed/rockinghorse/1200/900',
    blurb: 'Massivholz, handgeschliffen, kindersicher geölt.'
  },
  {
    title: 'Holz-Spielzeugtruck',
    image: 'https://picsum.photos/seed/toytruck/1200/900',
    blurb: 'Lenkbarer Aufbau, magnetische Ladefläche, unbehandelt.'
  },
  {
    title: 'Kinder-Tisch & Stuhl-Set',
    image: 'https://picsum.photos/seed/childset/1200/900',
    blurb: 'Birke Multiplex, abgerundete Kanten, strapazierfähige Oberfläche.'
  },
  {
    title: 'Music Box',
    image: 'https://picsum.photos/seed/musicbox/1200/900',
    blurb: 'Holzgehäuse mit Spieluhr-Mechanik.'
  },
  {
    title: 'Sitzbank',
    image: 'https://picsum.photos/seed/musicbox/1200/900',
    blurb: 'TODO'
  },
  {
    title: 'DIY Tischkreissäge',
    image: 'https://picsum.photos/seed/musicbox/1200/900',
    blurb: 'TODO'
  },
  {
    title: 'Männerhandtasche',
    image: 'https://picsum.photos/seed/musicbox/1200/900',
    blurb: 'TODO'
  },
  {
    title: 'Männerhandtasche',
    image: 'https://picsum.photos/seed/musicbox/1200/900',
    blurb: 'TODO'
  },
  {
    title: 'Baby Bett',
    image: 'https://picsum.photos/seed/musicbox/1200/900',
    blurb: 'TODO'
  }
]
</script>
