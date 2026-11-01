<template>
  <ul class="measure space-y-2.5 text-sm leading-relaxed text-pretty text-ink-muted">
    <li
      v-for="item in parsed"
      :key="item.key"
      class="flex gap-3"
    >
      <span
        aria-hidden="true"
        class="mt-[0.8em] h-px w-3 shrink-0 bg-ink-faint"
      />
      <span>
        <strong
          v-if="item.lead"
          class="font-medium text-ink"
        >{{ item.lead }}</strong>{{ item.rest }}
      </span>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

// Items may start with a **lead** phrase, which is emphasised so the list
// can be scanned by its first words.
const props = defineProps<{
  items: string[]
}>()

const parsed = computed(() => props.items.map((key) => {
  const m = key.match(/^\*\*(.+?)\*\*(.*)$/)
  return m ? { key, lead: m[1], rest: m[2] } : { key, lead: '', rest: key }
}))
</script>
