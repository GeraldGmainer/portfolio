<template>
  <div :class="['md:col-span-4', sticky ? 'md:sticky md:top-28 md:self-start' : '']">
    <div
      v-if="number || eyebrow"
      class="flex items-baseline gap-4"
    >
      <span
        v-if="number"
        class="font-mono text-xs tabular-nums text-accent"
      >{{ number }}</span>
      <UiEyebrow v-if="eyebrow">
        {{ eyebrow }}
      </UiEyebrow>
    </div>
    <h2 class="mt-3 font-display text-4xl leading-[1.05] tracking-tight text-ink md:text-5xl">
      <slot name="title">
        {{ title }}
      </slot>
    </h2>
    <p
      v-if="$slots.default"
      class="measure mt-5 text-base leading-relaxed text-ink-muted"
    >
      <slot />
    </p>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  title?: string
  number?: string
  eyebrow?: string
  sticky?: boolean
}>()
</script>
