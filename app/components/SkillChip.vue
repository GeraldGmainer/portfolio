<template>
  <span
      class="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#0B1220] px-3 py-2 text-s text-slate-200 ring-1 ring-white/10 hover:bg-white/5"
  >
    <span :class="tone">
      <svg
          v-if="icon === 'brackets'"
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          viewBox="0 0 24 24"
      >
        <path d="M9 7 4 12l5 5M15 7l5 5-5 5"/>
      </svg>
      <svg
          v-else-if="icon === 'server'"
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          viewBox="0 0 24 24"
      >
        <rect height="6" rx="1.5" width="18" x="3" y="4"/>
        <rect height="6" rx="1.5" width="18" x="3" y="14"/>
        <path d="M7 7h.01M7 17h.01"/>
      </svg>
      <svg
          v-else-if="icon === 'phone'"
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          viewBox="0 0 24 24"
      >
        <rect height="20" rx="2" width="10" x="7" y="2"/>
        <path d="M11 18h2"/>
      </svg>
      <svg
          v-else-if="icon === 'cube'"
          class="h-4 w-4"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          viewBox="0 0 24 24"
      >
        <path d="M12 3 21 8l-9 5L3 8l9-5Z"/>
        <path d="m3 12 9 5 9-5"/>
        <path d="m3 17 9 5 9-5"/>
      </svg>
    </span>
    <span>{{ label }}</span>
  </span>
</template>

<script lang="ts" setup>
const props = withDefaults(
    defineProps<{
      label: string
      icon: 'brackets' | 'server' | 'phone' | 'cube'
      tone?: string
    }>(),
    {
      tone: 'text-slate-200'
    }
)

const {label, icon, tone} = props
</script>
::contentReference[oaicite:0]{index=0}
