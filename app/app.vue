<template>
  <div class="min-h-screen bg-[#0B1220] text-slate-200 antialiased">
    <AppHeader />
    <main>
      <NuxtPage />
    </main>
    <Analytics v-if="consent"/>
    <AnalyticsConsent v-if="ready && !decided" @accept="accept" @decline="decline"/>
  </div>
</template>

<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import {Analytics} from '@vercel/analytics/nuxt'
import AnalyticsConsent from './components/AnalyticsConsent.vue'

useHead({
meta: [
{name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover'},
],
link: [{rel: 'icon', type: 'image/svg', href: '/logos/logo.svg'}],
htmlAttrs: {lang: 'de'},
titleTemplate: t => (t ? `Gerald Gmainer | ${t}` : 'Gerald Gmainer')
})

useSeoMeta({
ogVideo: '/videos/moneykoi_demo.mp4',
ogImage: '/images/screen1.png',
twitterImage: '/social/og.png',
twitterCard: 'summary_large_image'
})

const {consent, decided, ready, accept, decline} = useAnalyticsConsent()
</script>

<style scoped>
:global(html){scroll-behavior:smooth}
</style>
