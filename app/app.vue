<template>
  <div class="min-h-screen bg-[#0B1220] text-slate-200 antialiased">
    <AppHeader/>
    <main>
      <NuxtPage/>
    </main>
    <AppFooter/>
    <Analytics v-if="consent"/>
    <AnalyticsConsent v-if="ready && !decided" @accept="accept" @decline="decline"/>
  </div>
</template>

<script lang="ts" setup>
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import {Analytics} from '@vercel/analytics/nuxt'
import AnalyticsConsent from './components/AnalyticsConsent.vue'

useHead({
  meta: [
    {name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover'},
    {name: 'theme-color', content: '#0B1220'},
    {name: 'author', content: 'Gerald Gmainer'},
    {name: 'robots', content: 'index, follow'},
  ],
  link: [
    {rel: 'icon', type: 'image/svg+xml', href: '/logos/logo.svg'},
    {rel: 'apple-touch-icon', href: '/logos/logo.svg'},
  ],
  htmlAttrs: {lang: 'de'},
  titleTemplate: t => (t ? `Gerald Gmainer | ${t}` : 'Gerald Gmainer')
})


useSeoMeta({
  description: 'Full-Stack & 3D Entwickler aus Österreich. Moderne Web-Apps, Flutter Apps, 3D-Prototypen und saubere Architektur',
  ogTitle: 'Gerald Gmainer – App, Web & 3D',
  ogDescription: 'Moderne Web- & App-Entwicklung, Flutter, 3D und Full-Stack Projekte. Portfolio von Gerald Gmainer.',
  ogImage: '/ogimage.png',
  ogUrl: 'https://geraldgmainer.vercel.app/',
  ogType: 'website',
  ogVideo: '/videos/moneykoi_demo.mp4',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Gerald Gmainer – Full-Stack & 3D Entwickler',
  twitterDescription: 'Moderne Web-Apps, Flutter Apps und 3D-Prototypen aus Österreich.',
  formatDetection: 'telephone=no',
})

const {consent, decided, ready, accept, decline} = useAnalyticsConsent()
</script>

<style scoped>
:global(html) {
  scroll-behavior: smooth
}
</style>
