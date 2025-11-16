<template>
  <main class="min-h-screen bg-[#0B1220] text-slate-200">
    <PageHeader
        :badges="[
    'Garsten, Österreich · Remote/Hybrid',
    'Deutsch · Englisch · Japanisch',
    'Web · App · 3D',
    'Holzhandwerk'
  ]"
        :center="true"
        subtitle="Full-Stack-Entwickler mit Schwerpunkt auf Flutter-Apps, moderne Web-Technologien und 3D-Anwendungen. Ich entwickle robuste, nutzerzentrierte Produkte mit sauberer Architektur und Liebe zum Detail."
        title="Über mich"
    >
      <template #media>
        <img
            alt="Gerald Gmainer"
            class="h-64 w-64 rounded-2xl ring-2 ring-white/15 shadow-lg shadow-blue-500/20 object-cover"
            src="/images/profile.png"
        />
      </template>

      <template #actions>
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
      </template>
    </PageHeader>

    <section class="mx-auto max-w-4xl px-6 py-12">
      <div class="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 class="text-xl font-semibold">Kurzprofil</h2>
        <ul class="mt-4 space-y-3 text-s text-slate-300">
          <li class="flex gap-2">
            <span class="mt-0.5 text-cyan-400">
              <Icon name="lucide:dot" size="16"/>
            </span>
            <span>
              End-to-end-Entwicklung von Konzeption über UI/UX und Architektur bis zu Implementierung, Tests und Release.
            </span>
          </li>
          <li class="flex gap-2">
            <span class="mt-0.5 text-cyan-400">
              <Icon name="lucide:dot" size="16"/>
            </span>
            <span>
              Flutter-Apps mit lokalem Cache, konfliktarmem Sync und stabiler State-Architektur.
            </span>
          </li>
          <li class="flex gap-2">
            <span class="mt-0.5 text-cyan-400">
              <Icon name="lucide:dot" size="16"/>
            </span>
            <span>
              Moderne Webentwicklung mit TypeScript, klar strukturierten APIs und durchdachten Datenmodellen.
            </span>
          </li>
          <li class="flex gap-2">
            <span class="mt-0.5 text-cyan-400">
              <Icon name="lucide:dot" size="16"/>
            </span>
            <span>
              Architektur, Typisierung, Unit- und E2E-Tests sowie CI-Qualitätskontrollen.
            </span>
          </li>
          <li class="flex gap-2">
            <span class="mt-0.5 text-cyan-400">
              <Icon name="lucide:dot" size="16"/>
            </span>
            <span>
              Nutzerzentrierte Zusammenarbeit mit klarer Kommunikation, guten Tickets und hohem Ownership.
            </span>
          </li>
        </ul>
      </div>
    </section>

    <section class="mx-auto max-w-4xl px-6 pb-6">
      <div class="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-sky-500/10 p-7">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-center">
          <div class="flex-3 space-y-3">
            <h2 class="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Abseits vom Bildschirm
            </h2>
            <p class="text-sm leading-relaxed text-slate-300 sm:text-base">
              Wenn ich nicht vor dem Editor sitze, arbeite ich gern mit Holz:
              Aus einer kleinen Rassel für meinen Sohn wurden Möbel, Spielzeug und Alltagshelfer aus Massivholz.
            </p>
            <p class="text-sm leading-relaxed text-slate-300 sm:text-base">
              Der Working-Holiday in Japan – quer durchs Land von Hokkaido bis Okinawa – gehört zu den prägendsten Erfahrungen, die ich gemacht habe.
            </p>
          </div>
          <div class="flex-2">
            <div class="flex flex-col items-center gap-5">
              <NuxtLink
                  class="inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-slate-900 px-5 py-3 text-sm font-semibold ring-1 ring-white/20 hover:bg-slate-100"
                  to="/japan"
              >
                <Icon name="lucide:globe-2" size="18"/>
                <span>Japan Reisen und Aufenthalt</span>
              </NuxtLink>

              <NuxtLink
                  class="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/15 backdrop-blur hover:bg-white/15"
                  to="/woodworking"
              >
                <Icon name="lucide:hammer" size="18"/>
                <span>Holzarbeiten ansehen</span>
              </NuxtLink>
            </div>

          </div>
        </div>
      </div>
    </section>


    <section class="mx-auto max-w-6xl px-6 py-16">
      <h2 class="text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        Skillset
      </h2>
      <p class="mt-2 text-center text-slate-400">
        Technologien, mit denen ich arbeite
      </p>

      <div class="mt-10 grid gap-8 md:grid-cols-1">
        <div
            v-for="group in [
            { key: 'frontend', title: 'Frontend', shadow: 'shadow-sky-500/20' },
            { key: 'backend', title: 'Backend & CI/CD', shadow: 'shadow-blue-500/20' },
            { key: 'app', title: 'App', shadow: 'shadow-sky-500/20' },
            { key: 'threeD', title: '3D & Realtime', shadow: 'shadow-indigo-500/20' }
          ]"
            :key="group.key"
            :class="group.shadow"
            class="rounded-3xl border border-white/10 bg-white/5 p-7"
        >
          <div class="flex items-center justify-between gap-3">
            <h3 class="text-base font-semibold text-white">
              {{ group.title }}
            </h3>
          </div>
          <div class="mt-5 flex flex-wrap gap-5">
            <span
                v-for="s in stackSkills[group.key]"
                :key="s.label"
                class="inline-flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-1.5 text-xs lg:text-s text-slate-100 ring-1 ring-white/10"
            >
              <Icon :name="s.icon" class="h-4 w-4 lg:h-8 lg:w-8"/>
              <span>{{ s.label }}</span>
            </span>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-6 pb-20">
      <h2 class="text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">Tools</h2>
      <p class="mt-2 text-center text-slate-400">Werkzeuge, die meinen Alltag schneller machen</p>
      <div class="mt-10 grid gap-4 grid-cols-2 lg:grid-cols-5">
        <div
            v-for="tool in tools"
            :key="tool.label"
            class="grid h-24 place-items-center rounded-2xl border border-white/10 bg-white/5 text-sm ring-1 ring-white/5"
        >
          <div class="flex flex-col items-center gap-1 text-slate-200">
            <Icon v-if="tool.icon" :name="tool.icon" class="h-8 w-8"/>
            <span class="text-xs text-center">{{ tool.label }}</span>
          </div>
        </div>
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
    {label: 'Three.js', icon: 'simple-icons:threedotjs'},
    {label: 'State Management', icon: 'simple-icons:redux'},
    {label: 'Jest', icon: 'simple-icons:jest'},
    {label: 'Cypress', icon: 'simple-icons:cypress'},
    {label: 'Accessibility', icon: 'lucide:accessibility'}
  ],
  backend: [
    {label: 'Java', icon: 'simple-icons:coffeescript'},
    {label: 'Spring Boot', icon: 'simple-icons:spring'},
    {label: 'Node.js', icon: 'simple-icons:nodedotjs'},
    {label: 'Express/Nest', icon: 'lucide:route'},
    {label: 'REST', icon: 'lucide:server'},
    {label: 'GraphQL', icon: 'simple-icons:graphql'},
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
    {label: 'Observability', icon: 'lucide:activity'}
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
    {label: 'Fehlertracking', icon: 'lucide:alert-triangle'},
    {label: 'Fastlane', icon: 'simple-icons:fastlane'},
    {label: 'FVM', icon: 'lucide:layers'},
    {label: 'i18n/Localization', icon: 'lucide:languages'},
    {label: 'Store Releases', icon: 'lucide:app-window'}
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
    {label: 'Profiling/Optimierung', icon: 'lucide:gauge'},
    {label: 'ARKit/ARCore', icon: 'lucide:scan'},
    {label: 'Blender', icon: 'simple-icons:blender'},
    {label: 'Photoshop', icon: 'simple-icons:adobephotoshop'}
  ]
}

const tools = [
  {label: 'Android Studio', icon: 'simple-icons:androidstudio'},
  {label: 'IntelliJ IDEA', icon: 'simple-icons:intellijidea'},
  {label: 'VS Code', icon: 'simple-icons:visualstudiocode'},
  {label: 'Git', icon: 'simple-icons:git'},
  {label: 'GitHub', icon: 'simple-icons:github'},
  {label: 'Ubuntu/Linux', icon: 'simple-icons:ubuntu'},
  {label: 'macOS', icon: 'simple-icons:macos'},
  {label: 'Jenkins', icon: 'simple-icons:jenkins'},
  {label: 'Docker Desktop', icon: 'simple-icons:docker'},
  {label: 'Postman', icon: 'simple-icons:postman'},
  {label: 'Supabase Studio', icon: 'simple-icons:supabase'},
  {label: 'Xcode', icon: 'simple-icons:xcode'},
  {label: 'Fastlane', icon: 'simple-icons:fastlane'},
  {label: 'Vercel', icon: 'simple-icons:vercel'},
  {label: 'Figma', icon: 'simple-icons:figma'},
  {label: 'Jira', icon: 'simple-icons:jira'},
  {label: 'Sentry', icon: 'simple-icons:sentry'},
  {label: 'Grafana', icon: 'simple-icons:grafana'},
  {label: 'Photoshop', icon: 'simple-icons:adobephotoshop'},
  {label: 'Blender', icon: 'simple-icons:blender'}
]

</script>
