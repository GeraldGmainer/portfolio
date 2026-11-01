<template>
  <div
    class="flex items-center gap-4"
    role="separator"
  >
    <UiEyebrow
      v-if="label"
      class="shrink-0"
    >
      {{ label }}
    </UiEyebrow>
    <span class="h-px flex-1 bg-line" />
  </div>
</template>

<script lang="ts" setup>
defineProps<{ label?: string }>()
</script>
