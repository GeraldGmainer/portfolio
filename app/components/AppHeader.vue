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

      <button
          class="sm:hidden inline-flex items-center justify-center rounded-md p-2 text-slate-200 hover:bg-white/10 ring-1 ring-white/10 backdrop-blur"
          @click="toggle"
      >
        <Icon v-if="!open" name="lucide:menu" size="22"/>
        <Icon v-else name="lucide:x" size="22"/>
      </button>
    </div>

    <transition name="slide">
      <div
          v-if="open"
          class="sm:hidden bg-[#050816]/95 backdrop-blur px-6 pb-6 pt-4 border-t border-white/10"
      >
        <div class="flex flex-col gap-4 text-base font-medium text-slate-200">
          <NuxtLink class="transition hover:text-white" to="/" @click="close">Home</NuxtLink>
          <NuxtLink class="transition hover:text-white" to="/about" @click="close">Über mich</NuxtLink>
          <NuxtLink class="transition hover:text-white" to="/resume" @click="close">Lebenslauf</NuxtLink>
          <NuxtLink class="transition hover:text-white" to="/projects" @click="close">Projekte</NuxtLink>
          <NuxtLink class="transition hover:text-white" to="/woodworking" @click="close">Holzhandwerk</NuxtLink>
          <NuxtLink class="transition hover:text-white" to="/japan" @click="close">Japan</NuxtLink>
          <NuxtLink
              class="rounded-full bg-white/10 px-4 py-2 text-white shadow-sm ring-1 ring-white/15 backdrop-blur transition hover:bg-white/15 text-center"
              to="/contact"
              @click="close"
          >
            Kontakt
          </NuxtLink>
        </div>
      </div>
    </transition>

    <div class="pointer-events-none h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
  </header>
</template>

<script lang="ts" setup>
import {onBeforeUnmount, onMounted, ref} from 'vue'

const open = ref(false)
const toggle = () => (open.value = !open.value)
const close = () => (open.value = false)

const isScrolled = ref(false)
const handleScroll = () => {
  if (typeof window === 'undefined') return
  isScrolled.value = window.scrollY > 10
}
onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, {passive: true})
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-enter-active,
.slide-leave-active {
  transition: all .25s ease;
}
</style>
