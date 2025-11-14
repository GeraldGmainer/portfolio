<template>
  <main class="min-h-screen bg-[#0B1220] text-slate-200">
    <section class="relative bg-center bg-cover" style="background-image:url('/hero-bg.svg')">
      <div class="mx-auto max-w-6xl px-6 pt-28 pb-12">
        <div class="flex flex-col items-center text-center">
          <img
              alt="Gerald Gmainer"
              class="h-64 w-64 rounded-2xl ring-2 ring-white/15 shadow-lg shadow-blue-500/20 object-cover"
              src="/images/profile.png"
          />
          <h1 class="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">Über mich</h1>
          <p class="mt-3 max-w-2xl text-slate-300">
            Full-Stack-Entwickler mit Fokus auf Flutter-Apps, moderne Web-Stacks und 3D Anwendungen. Ich baue
            performante Produkte mit sauberer Architektur, Offline-First und Liebe zum Detail.
          </p>
          <div class="mt-6 inline-flex flex-wrap justify-center gap-2">
            <span class="rounded-full bg-white/10 px-3 py-1 text-xs ring-1 ring-white/10">
              Garsten, Österreich · Remote/Hybrid
            </span>
            <span class="rounded-full bg-white/10 px-3 py-1 text-xs ring-1 ring-white/10">
              Deutsch · Englisch · Japanisch
            </span>
            <span class="rounded-full bg-white/10 px-3 py-1 text-xs ring-1 ring-white/10">
              Web · App · 3D
            </span>
            <span class="rounded-full bg-white/10 px-3 py-1 text-xs ring-1 ring-white/10">
              Hobby: Holzhandwerk
            </span>
          </div>
          <div class="mt-8 flex gap-3">
            <NuxtLink
                class="inline-flex items-center gap-2 rounded-2xl bg-white text-slate-900 px-5 py-3 text-sm font-semibold ring-1 ring-white/20"
                to="/resume"
            >
              <Icon name="lucide:file-text" size="18"/>
              <span>Lebenslauf</span>
            </NuxtLink>
            <NuxtLink
                class="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/15 backdrop-blur hover:bg-white/15"
                to="/contact"
            >
              <Icon name="lucide:mail" size="18"/>
              <span>Kontakt</span>
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
            <li class="flex gap-2">
              <span class="mt-0.5 text-cyan-400">
                <Icon name="lucide:dot" size="16"/>
              </span>
              <span>
                End-to-end Entwicklung: Konzeption, UI/UX, Architektur, Implementierung, Testing und Release.
              </span>
            </li>
            <li class="flex gap-2">
              <span class="mt-0.5 text-cyan-400">
                <Icon name="lucide:dot" size="16"/>
              </span>
              <span>
                Flutter-Apps mit lokalem Cache, konfliktarmem Sync und sauberen State-Patterns.
              </span>
            </li>
            <li class="flex gap-2">
              <span class="mt-0.5 text-cyan-400">
                <Icon name="lucide:dot" size="16"/>
              </span>
              <span>
                Web mit TypeScript, moderne Frameworks, sichere APIs und Datenmodelle.
              </span>
            </li>
            <li class="flex gap-2">
              <span class="mt-0.5 text-cyan-400">
                <Icon name="lucide:dot" size="16"/>
              </span>
              <span>
                3D/Realtime: Unity, Three.js/WebGL, Performance-Optimierung und Tooling.
              </span>
            </li>
          </ul>
        </div>

        <div class="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 class="text-xl font-semibold">Werte & Arbeitsweise</h2>
          <ul class="mt-4 space-y-3 text-s text-slate-300">
            <li class="flex gap-2">
              <span class="mt-0.5 text-cyan-400">
                <Icon name="lucide:dot" size="16"/>
              </span>
              <span>
                Nutzerzentriert & ergebnisorientiert: klare Ziele, kurze Iterationen, messbare Wirkung (LCP,
                Crash-Rate, Conversion).
              </span>
            </li>
            <li class="flex gap-2">
              <span class="mt-0.5 text-cyan-400">
                <Icon name="lucide:dot" size="16"/>
              </span>
              <span>
                Architektur & Code-Qualität: saubere Domänen, stabile APIs, starke Typisierung, Tests (Unit/E2E) und
                CI-Gates.
              </span>
            </li>
            <li class="flex gap-2">
              <span class="mt-0.5 text-cyan-400">
                <Icon name="lucide:dot" size="16"/>
              </span>
              <span>
                Performance & Stabilität: Offline-First, Caching/Sync, Profiling, Observability (Logs/Metrics),
                Sentry/Crashlytics, Security-by-default (RLS, Least-Privilege).
              </span>
            </li>
            <li class="flex gap-2">
              <span class="mt-0.5 text-cyan-400">
                <Icon name="lucide:dot" size="16"/>
              </span>
              <span>
                Zusammenarbeit & Ownership: transparente Kommunikation, gute Tickets/Docs, verlässliche Zusagen,
                respektvolle Reviews.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-6 pb-4">
    </section>

    <section class="mx-auto max-w-6xl px-6 py-16">
      <h2 class="text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        Skillset
      </h2>
      <p class="mt-2 text-center text-slate-400">
        Technologien, mit denen ich regelmäßig arbeite
      </p>

      <div class="mt-10 grid gap-8 md:grid-cols-2">
        <div class="rounded-3xl border border-white/10 bg-white/5 p-7 shadow-sm shadow-sky-500/20">
          <div class="flex items-center justify-between gap-3">
            <h3 class="text-base font-semibold text-white">Frontend</h3>
          </div>
          <div class="mt-5 flex flex-wrap gap-3">
            <span
                v-for="s in stackSkills.frontend"
                :key="s.label"
                class="inline-flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-1.5 text-xs text-slate-100 ring-1 ring-white/10"
            >
              <Icon :name="s.icon" class="h-4 w-4"/>
              <span>{{ s.label }}</span>
            </span>
          </div>
        </div>

        <div class="rounded-3xl border border-white/10 bg-white/5 p-7 shadow-sm shadow-blue-500/20">
          <div class="flex items-center justify-between gap-3">
            <h3 class="text-base font-semibold text-white">Backend &amp; CI/CD</h3>
          </div>
          <div class="mt-5 flex flex-wrap gap-3">
            <span
                v-for="s in stackSkills.backend"
                :key="s.label"
                class="inline-flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-1.5 text-xs text-slate-100 ring-1 ring-white/10"
            >
              <Icon :name="s.icon" class="h-4 w-4"/>
              <span>{{ s.label }}</span>
            </span>
          </div>
        </div>

        <div class="rounded-3xl border border-white/10 bg-white/5 p-7 shadow-sm shadow-sky-500/20">
          <div class="flex items-center justify-between gap-3">
            <h3 class="text-base font-semibold text-white">App</h3>
          </div>
          <div class="mt-5 flex flex-wrap gap-3">
            <span
                v-for="s in stackSkills.app"
                :key="s.label"
                class="inline-flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-1.5 text-xs text-slate-100 ring-1 ring-white/10"
            >
              <Icon :name="s.icon" class="h-4 w-4"/>
              <span>{{ s.label }}</span>
            </span>
          </div>
        </div>

        <div class="rounded-3xl border border-white/10 bg-white/5 p-7 shadow-sm shadow-indigo-500/20">
          <div class="flex items-center justify-between gap-3">
            <h3 class="text-base font-semibold text-white">3D &amp; Realtime</h3>
          </div>
          <div class="mt-5 flex flex-wrap gap-3">
            <span
                v-for="s in stackSkills.threeD"
                :key="s.label"
                class="inline-flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-1.5 text-xs text-slate-100 ring-1 ring-white/10"
            >
              <Icon :name="s.icon" class="h-4 w-4"/>
              <span>{{ s.label }}</span>
            </span>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-6 pb-20">
      <h2 class="text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">Tools</h2>
      <p class="mt-2 text-center text-slate-400">Werkzeuge, die meinen Alltag schneller machen</p>
      <div class="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <div
            v-for="tool in tools"
            :key="tool.label"
            class="grid h-24 place-items-center rounded-2xl border border-white/10 bg-white/5 text-sm ring-1 ring-white/5"
        >
          <div class="flex flex-col items-center gap-1 text-slate-200">
            <Icon v-if="tool.icon" :name="tool.icon" class="h-5 w-5"/>
            <span class="text-xs text-center">{{ tool.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <section id="woodwork" class="mx-auto max-w-6xl px-6 pb-24">
      <h2 class="text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        Holzarbeiten
      </h2>
      <p class="mt-2 text-center text-slate-400">
        Kleines Nebenprojekt – echtes Handwerk
      </p>
      <p class="mx-auto mt-3 max-w-2xl text-center text-sm text-slate-300">
        Angefangen hat alles mit einer einfachen Holzrassel für meinen ältesten Sohn.
        Aus diesem ersten Projekt wurde Schritt für Schritt eine echte Leidenschaft
        für Spielzeug, Möbel und kleine Alltagshelfer aus Massivholz.
      </p>

      <div class="mt-10 grid gap-6 md:grid-cols-3">
        <figure
            v-for="w in woodProjects"
            :key="w.title"
            class="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 ring-1 ring-white/5 transition hover:-translate-y-0.5 hover:ring-white/20"
        >
          <div class="aspect-[4/3] w-full overflow-hidden">
            <img
                :alt="w.title"
                :src="w.image"
                class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
          <figcaption class="p-5">
            <h3 class="text-base font-semibold text-white">
              {{ w.title }}
            </h3>
            <p class="mt-2 text-sm leading-relaxed text-slate-300">
              {{ w.blurb }}
            </p>
          </figcaption>
        </figure>
      </div>
    </section>
  </main>
</template>

<script lang="ts" setup>
const stackSkills = {
  frontend: [
    {label: 'TypeScript', icon: 'simple-icons:typescript'},
    {label: 'Angular', icon: 'simple-icons:angular'},
    {label: 'React', icon: 'simple-icons:react'},
    {label: 'Vue', icon: 'simple-icons:vuedotjs'},
    {label: 'Nuxt', icon: 'simple-icons:nuxtdotjs'},
    {label: 'Next.js', icon: 'simple-icons:nextdotjs'},
    {label: 'Tailwind CSS', icon: 'simple-icons:tailwindcss'},
    {label: 'Vite', icon: 'simple-icons:vite'},
    {label: 'Three.js/WebGL', icon: 'simple-icons:threedotjs'},
    {label: 'Zustand/Redux/ngrx', icon: 'simple-icons:redux'},
    {label: 'Jest', icon: 'simple-icons:jest'},
    {label: 'Cypress', icon: 'simple-icons:cypress'},
    {label: 'Accessibility', icon: 'lucide:accessibility'}
  ],

  backend: [
    {label: 'Java', icon: 'simple-icons:java'},
    {label: 'Spring Boot', icon: 'simple-icons:spring'},
    {label: 'Node.js', icon: 'simple-icons:nodedotjs'},
    {label: 'Express/Nest', icon: 'lucide:route'},
    {label: 'GraphQL/REST', icon: 'simple-icons:graphql'},
    {label: 'PostgreSQL', icon: 'simple-icons:postgresql'},
    {label: 'Supabase', icon: 'simple-icons:supabase'},
    {label: 'MySQL', icon: 'simple-icons:mysql'},
    {label: 'Keycloak', icon: 'simple-icons:keycloak'},
    {label: 'Docker', icon: 'simple-icons:docker'},
    {label: 'Kubernetes', icon: 'simple-icons:kubernetes'},
    {label: 'NGINX', icon: 'simple-icons:nginx'},
    {label: 'Git', icon: 'simple-icons:git'},
    {label: 'GitHub Actions', icon: 'simple-icons:githubactions'},
    {label: 'Jenkins', icon: 'simple-icons:jenkins'},
    {label: 'Vercel', icon: 'simple-icons:vercel'},
    {label: 'CI/CD', icon: 'lucide:workflow'},
    {label: 'Monitoring/Logging', icon: 'lucide:activity'}
  ],

  app: [
    {label: 'Flutter', icon: 'simple-icons:flutter'},
    {label: 'Dart', icon: 'simple-icons:dart'},
    {label: 'Android/Kotlin', icon: 'simple-icons:android'},
    {label: 'iOS/Swift', icon: 'simple-icons:swift'},
    {label: 'Offline-First', icon: 'lucide:cloud-off'},
    {label: 'Background Tracking', icon: 'lucide:locate-fixed'},
    {label: 'Maps/Geolocation', icon: 'lucide:map'},
    {label: 'Push Notifications', icon: 'lucide:bell'},
    {label: 'Sentry/Crashlytics', icon: 'lucide:alert-triangle'},
    {label: 'Fastlane', icon: 'simple-icons:fastlane'},
    {label: 'FVM', icon: 'lucide:layers'},
    {label: 'Localization/i18n', icon: 'lucide:languages'},
    {label: 'Store-Assets & Releases', icon: 'lucide:app-window'}
  ],

  threeD: [
    {label: 'Unity', icon: 'simple-icons:unity'},
    {label: 'C#', icon: 'simple-icons:csharp'},
    {label: 'C++', icon: 'simple-icons:cplusplus'},
    {label: 'Three.js', icon: 'simple-icons:threedotjs'},
    {label: 'WebGL', icon: 'lucide:monitor'},
    {label: 'Shader (HLSL/GLSL)', icon: 'lucide:sparkles'},
    {label: 'Post-Processing', icon: 'lucide:contrast'},
    {label: 'Physics/Animation', icon: 'lucide:orbit'},
    {label: 'Optimization/Profiling', icon: 'lucide:gauge'},
    {label: 'ARKit/ARCore', icon: 'lucide:scan'},
    {label: 'Blender', icon: 'simple-icons:blender'},
    {label: 'Photoshop', icon: 'simple-icons:adobephotoshop'}
  ]
}

const tools = [
  {label: 'Android Studio', icon: 'simple-icons:androidstudio'},
  {label: 'IntelliJ IDEA', icon: 'simple-icons:intellijidea'},
  {label: 'VS Code', icon: 'simple-icons:visualstudiocode'},
  {label: 'Figma', icon: 'simple-icons:figma'},
  {label: 'Photoshop', icon: 'simple-icons:adobephotoshop'},
  {label: 'Blender', icon: 'simple-icons:blender'},
  {label: 'Linux/Ubuntu', icon: 'simple-icons:ubuntu'},
  {label: 'Git', icon: 'simple-icons:git'},
  {label: 'GitHub', icon: 'simple-icons:github'},
  {label: 'Jenkins/CI', icon: 'simple-icons:jenkins'},
  {label: 'Docker Desktop', icon: 'simple-icons:docker'},
  {label: 'Postman', icon: 'simple-icons:postman'},
  {label: 'Supabase Studio', icon: 'simple-icons:supabase'},
  {label: 'Xcode', icon: 'simple-icons:xcode'},
  {label: 'Fastlane', icon: 'simple-icons:fastlane'}
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
    image: 'https://picsum.photos/seed/musicbox1/1200/900',
    blurb: 'Holzgehäuse mit Spieluhr-Mechanik.'
  },
  {
    title: 'Sitzbank',
    image: 'https://picsum.photos/seed/bench/1200/900',
    blurb: 'Massive Bank mit klarer Formensprache für Flur oder Essbereich.'
  },
  {
    title: 'DIY Tischkreissäge',
    image: 'https://picsum.photos/seed/tablesaw/1200/900',
    blurb: 'Eigenbau-Säge mit Fokus auf Präzision und Sicherheit.'
  },
  {
    title: 'Männerhandtasche',
    image: 'https://picsum.photos/seed/mantasche/1200/900',
    blurb: 'Kompakte Tragelösung aus Holz für Werkzeug oder Kleinteile.'
  },
  {
    title: 'Werkstatt-Organizer',
    image: 'https://picsum.photos/seed/organizer/1200/900',
    blurb: 'Regal für Schrauben, Bits und Zubehör – alles griffbereit.'
  },
  {
    title: 'Baby Bett',
    image: 'https://picsum.photos/seed/babybed/1200/900',
    blurb: 'Stabiles Gitterbett mit abgerundeten Kanten und natürlicher Oberfläche.'
  }
]
</script>
