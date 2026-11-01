<template>
  <Analytics v-if="consent" />
  <div
    v-if="ready && !decided"
    :aria-label="$t('consent.label')"
    aria-live="polite"
    class="fixed bottom-5 left-5 right-5 z-40 max-w-sm rounded-lg border border-line bg-navy-800 p-5 sm:left-auto"
    role="dialog"
  >
    <UiEyebrow>{{ $t('consent.eyebrow') }}</UiEyebrow>
    <p class="mt-3 text-sm leading-relaxed text-ink">
      {{ $t('consent.text') }}
    </p>
    <p class="mt-2 text-xs leading-relaxed text-ink-muted">
      {{ $t('consent.note') }}
    </p>
    <div class="mt-5 flex items-center gap-5">
      <button
        class="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-navy-950 transition-colors duration-150 hover:bg-accent"
        type="button"
        @click="accept"
      >
        {{ $t('consent.accept') }}
      </button>
      <button
        class="link-underline text-sm text-ink-muted transition-colors duration-150 hover:text-ink"
        type="button"
        @click="decline"
      >
        {{ $t('consent.decline') }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Analytics } from '@vercel/analytics/nuxt'

const { consent, decided, ready, load, accept, decline } = useAnalyticsConsent()

onMounted(load)
</script>
