<template>
  <header class="fixed inset-x-0 top-0 z-50">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
      <NuxtLink to="/" class="inline-flex items-center gap-3">
        <img src="/logos/logo.svg" alt="Gerald Gmainer Logo"
             class="h-9 w-9 sm:h-12 sm:w-12 rounded-xl shadow-sm shadow-blue-500/20" />
        <span class="text-lg font-semibold tracking-tight text-slate-100 sm:text-xl">Gerald Gmainer</span>
      </NuxtLink>

      <nav class="hidden items-center gap-6 text-sm font-medium text-slate-300 sm:flex">
        <NuxtLink to="/about" class="transition hover:text-white">Über mich</NuxtLink>
        <NuxtLink to="/resume" class="transition hover:text-white">Lebenslauf</NuxtLink>
        <NuxtLink to="/projects" class="transition hover:text-white">Projekte</NuxtLink>
        <NuxtLink to="/contact" class="rounded-full bg-white/10 px-4 py-2 text-white shadow-sm ring-1 ring-white/15 backdrop-blur transition hover:bg-white/15">Kontakt</NuxtLink>
      </nav>
    </div>
    <div class="pointer-events-none h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
  </header>
</template>

<script lang="ts" setup>
</script>

<style scoped>
.grid-overlay{
  background:
      radial-gradient(60rem 60rem at 50% -10%, rgba(37,99,235,.16), transparent 60%),
      radial-gradient(40rem 40rem at 80% 10%, rgba(56,189,248,.12), transparent 60%),
      radial-gradient(36rem 36rem at 20% 10%, rgba(59,130,246,.12), transparent 60%);
}
.grid-overlay::before{
  content:"";
  position:absolute; inset:0;
  background-image:
      linear-gradient(to right, rgba(255,255,255,.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,.05) 1px, transparent 1px);
  background-size:48px 48px;
  mask-image: radial-gradient(80rem 50rem at 50% 0%, #000 60%, transparent);
  opacity:.5;
}
</style>
