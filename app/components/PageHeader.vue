<template>
  <section class="relative bg-center bg-cover" style="background-image:url('/hero-bg.svg')">
    <div :class="center ? 'mx-auto max-w-6xl px-6 pt-32 pb-20 text-center' : 'mx-auto max-w-6xl px-6 pt-28 pb-10'">
      <div v-if="center" class="flex flex-col items-center text-center">
        <p
            v-if="pill"
            class="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-medium text-slate-300 ring-1 ring-white/10 backdrop-blur"
        >
          {{ pill }}
        </p>

        <slot name="media"/>

        <h1 class="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">
          {{ title }}
        </h1>

        <p
            v-if="subtitle"
            class="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base"
        >
          {{ subtitle }}
        </p>

        <div
            v-if="badges && badges.length"
            class="mt-6 inline-flex flex-wrap justify-center gap-2"
        >
          <span
              v-for="badge in badges"
              :key="badge"
              class="rounded-full bg-white/10 px-3 py-1 text-xs ring-1 ring-white/10"
          >
            {{ badge }}
          </span>
        </div>

        <div class="mt-8 flex flex-wrap justify-center gap-3">
          <slot name="actions"/>
        </div>
      </div>

      <div v-else>
        <div class="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl">
            {{ title }}
          </h1>
          <slot name="actions"/>
        </div>

        <p v-if="subtitle" class="mt-3 text-slate-400">
          {{ subtitle }}
        </p>

        <div
            v-if="badges && badges.length"
            class="mt-6 inline-flex flex-wrap justify-start gap-2"
        >
          <span
              v-for="badge in badges"
              :key="badge"
              class="rounded-full bg-white/10 px-3 py-1 text-xs ring-1 ring-white/10"
          >
            {{ badge }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
const {title, subtitle, center, pill, badges} = defineProps<{
  title: string
  subtitle?: string
  center?: boolean
  pill?: string
  badges?: string[]
}>()
</script>
