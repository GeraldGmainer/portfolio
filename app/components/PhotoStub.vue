<template>
  <div
    role="img"
    :aria-label="$t('common.photoMissing', { name })"
    class="photo-stub grid place-items-center overflow-hidden border border-dashed border-line-strong bg-navy-900 text-center"
  >
    <Icon
      v-if="compact"
      name="lucide:camera-off"
      size="16"
      class="text-ink-faint"
    />
    <div
      v-else
      class="px-4"
    >
      <Icon
        name="lucide:camera-off"
        size="18"
        class="text-ink-faint"
      />
      <p class="mt-3 font-display text-xl leading-tight text-ink-muted">
        {{ name }}
      </p>
      <p class="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
        Foto fehlt
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
/** Stand-in for a place that has no photo yet; `compact` is icon only. */
defineProps<{
  name: string
  compact?: boolean
}>()
</script>

<style scoped>
.photo-stub {
  background-image: repeating-linear-gradient(135deg, var(--color-line) 0 1px, transparent 1px 9px);
}
</style>
