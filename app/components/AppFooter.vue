<template>
  <footer class="border-t border-white/10 bg-[#050816]">
    <div class="mx-auto max-w-6xl px-6 py-10">
      <div class="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
        <p class="text-sm text-slate-400">
          © 2025 Gerald Gmainer
        </p>

        <nav class="flex items-center gap-6 text-sm">
          <NuxtLink class="text-slate-400 transition hover:text-white" to="/legal/imprint">
            Impressum
          </NuxtLink>

          <NuxtLink class="text-slate-400 transition hover:text-white" to="/legal/privacy">
            Datenschutzerklärung
          </NuxtLink>
        </nav>
      </div>
    </div>
  </footer>
</template>
