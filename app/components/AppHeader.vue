<template>
  <header
      :class="[
      'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
      isScrolled ? 'bg-[#050816]/85' : 'bg-transparent'
    ]"
  >
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
      <NuxtLink class="inline-flex items-center gap-3" to="/">
        <img
            alt="Gerald Gmainer Logo"
            class="h-9 w-9 sm:h-12 sm:w-12 rounded-xl shadow-sm shadow-blue-500/20"
            src="/logos/logo.svg"
        />
        <span class="text-lg font-semibold tracking-tight text-slate-100 sm:text-xl">Gerald Gmainer</span>
      </NuxtLink>

      <nav class="hidden items-center gap-6 text-sm font-medium text-slate-300 sm:flex">
        <NuxtLink active-class="text-sky-400" class="transition hover:text-white" exact-active-class="text-sky-400 font-semibold" to="/">Home</NuxtLink>
        <NuxtLink active-class="text-sky-400" class="transition hover:text-white" exact-active-class="text-sky-400 font-semibold" to="/about">Über mich</NuxtLink>
        <NuxtLink active-class="text-sky-400" class="transition hover:text-white" exact-active-class="text-sky-400 font-semibold" to="/resume">Lebenslauf</NuxtLink>
        <NuxtLink active-class="text-sky-400" class="transition hover:text-white" exact-active-class="text-sky-400 font-semibold" to="/projects">Projekte</NuxtLink>
        <NuxtLink active-class="text-sky-400" class="transition hover:text-white" exact-active-class="text-sky-400 font-semibold" to="/woodworking">Holzhandwerk</NuxtLink>
        <NuxtLink active-class="text-sky-400" class="transition hover:text-white" exact-active-class="text-sky-400 font-semibold" to="/japan">Japan</NuxtLink>
        <NuxtLink
            active-class="ring-sky-400 bg-white/20 text-sky-300"
            class="rounded-full bg-white/10 px-4 py-2 text-white shadow-sm ring-1 ring-white/15 backdrop-blur transition hover:bg-white/15"
            exact-active-class="ring-sky-400 bg-white/20 text-sky-300 font-semibold"
            to="/contact"
        >
          Kontakt
        </NuxtLink>
      </nav>
    </div>
    <div class="pointer-events-none h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
  </header>
</template>

<script lang="ts" setup>
import {onBeforeUnmount, onMounted, ref} from 'vue'

const isScrolled = ref(false)

const handleScroll = () => {
  if (typeof window === 'undefined') return
  isScrolled.value = window.scrollY > 10
}

onMounted(() => {
  if (typeof window === 'undefined') return
  handleScroll()
  window.addEventListener('scroll', handleScroll, {passive: true})
})

onBeforeUnmount(() => {
  if (typeof window === 'undefined') return
  window.removeEventListener('scroll', handleScroll)
})
</script>

