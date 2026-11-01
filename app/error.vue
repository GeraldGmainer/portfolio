<template>
  <div class="grain min-h-screen bg-navy-900 text-ink antialiased">
    <AppHeader />
    <main class="mx-auto max-w-6xl px-6 pb-24 pt-32 md:px-10 md:pb-32 md:pt-40">
      <UiEyebrow class="block">
        {{ error.statusCode }}
      </UiEyebrow>
      <h1 class="mt-5 font-display text-5xl leading-[1] tracking-tight text-ink md:text-7xl">
        {{ l(isNotFound ? copy.notFoundTitle : copy.errorTitle) }}
      </h1>
      <p class="measure mt-6 text-lg leading-relaxed text-ink-muted">
        {{ l(isNotFound ? copy.notFoundText : copy.errorText) }}
      </p>
      <div class="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
        <UiButtonLink
          icon="lucide:arrow-right"
          to="/"
          variant="primary"
        >
          {{ l(copy.home) }}
        </UiButtonLink>
        <UiButtonLink to="/projects">
          {{ $t('common.allProjects') }}
        </UiButtonLink>
        <UiButtonLink to="/blog">
          {{ $t('nav.blog') }}
        </UiButtonLink>
      </div>
    </main>
    <AppFooter />
    <AnalyticsConsent />
  </div>
</template>

<script lang="ts" setup>
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const l = useLocalized()
const { locale } = useI18n()

const isNotFound = computed(() => props.error.statusCode === 404)

const copy = {
  notFoundTitle: { de: 'Diese Seite gibt es nicht.', en: 'This page doesn\'t exist.' },
  notFoundText: {
    de: 'Der Link ist vielleicht veraltet. Von der Startseite aus findest du alle Projekte und Beiträge.',
    en: 'The link may be out of date. From the home page you can reach every project and post.'
  },
  errorTitle: { de: 'Da ist etwas schiefgelaufen.', en: 'Something went wrong.' },
  errorText: {
    de: 'Die Seite konnte nicht geladen werden. Versuch es gleich noch einmal.',
    en: 'The page could not be loaded. Please try again in a moment.'
  },
  home: { de: 'Zur Startseite', en: 'Back to home' }
}

useHead(() => ({
  htmlAttrs: { lang: locale.value },
  title: l(isNotFound.value ? copy.notFoundTitle : copy.errorTitle),
  titleTemplate: '%s | Gerald Gmainer',
  meta: [{ name: 'robots', content: 'noindex, follow' }],
  link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]
}))
</script>
