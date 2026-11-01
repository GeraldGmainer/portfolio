<template>
  <a
    v-if="isExternal"
    :class="classes"
    :href="to"
    :rel="isHttp ? 'noopener' : undefined"
    :target="isHttp ? '_blank' : undefined"
  >
    <span :class="variant === 'secondary' ? 'link-underline' : ''"><slot /></span>
    <Icon
      v-if="icon"
      :name="icon"
      :size="variant === 'primary' ? 16 : 15"
      class="shrink-0 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
    />
  </a>
  <NuxtLink
    v-else
    :class="classes"
    :to="localePath(to)"
  >
    <span :class="variant === 'secondary' ? 'link-underline' : ''"><slot /></span>
    <Icon
      v-if="icon"
      :name="icon"
      :size="variant === 'primary' ? 16 : 15"
      class="shrink-0 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
    />
  </NuxtLink>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  to: string
  variant?: 'primary' | 'secondary'
  external?: boolean
  icon?: string | false
}>(), {
  variant: 'secondary',
  external: false,
  icon: 'lucide:arrow-up-right'
})

const localePath = useLocalePath()

const isHttp = computed(() => /^https?:\/\//.test(props.to))
const isExternal = computed(() => props.external || isHttp.value || /^(mailto|tel):/.test(props.to))

const classes = computed(() => props.variant === 'primary'
  ? 'group inline-flex items-center gap-2 rounded-md bg-ink px-5 py-3 text-sm font-semibold text-navy-950 transition-colors duration-150 hover:bg-accent'
  : 'group inline-flex items-center gap-1.5 text-sm font-medium text-ink transition-colors duration-150 hover:text-accent')
</script>
