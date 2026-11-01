<template>
  <dialog
    ref="dialog"
    class="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 text-ink backdrop:bg-navy-950/95"
    :aria-label="current?.title"
    @close="emit('update:index', null)"
    @keydown.left.prevent="go(-1)"
    @keydown.right.prevent="go(1)"
  >
    <div
      v-if="current"
      class="flex h-full flex-col"
    >
      <div class="flex items-center justify-between px-6 pt-5">
        <span class="font-mono text-xs tabular-nums text-ink-faint">
          {{ String(index! + 1).padStart(2, '0') }} / {{ String(items.length).padStart(2, '0') }}
        </span>
        <button
          type="button"
          :aria-label="$t('common.close')"
          class="grid h-10 w-10 place-items-center rounded border border-line text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
          @click="close"
        >
          <Icon
            name="lucide:x"
            :size="18"
          />
        </button>
      </div>

      <div
        class="relative flex min-h-0 flex-1 touch-pan-y items-center justify-center px-4 py-4 md:px-20"
        @click.self="onBackdrop"
        @pointerdown="onSwipeStart"
        @pointerup="onSwipeEnd"
      >
        <Transition
          mode="out-in"
          enter-active-class="transition-opacity duration-200"
          enter-from-class="opacity-0"
          leave-active-class="transition-opacity duration-150"
          leave-to-class="opacity-0"
        >
          <img
            :key="current.src"
            :src="current.src"
            :alt="current.title"
            class="max-h-full max-w-full rounded-md border border-line object-contain"
            draggable="false"
          >
        </Transition>

        <button
          v-for="dir in [-1, 1]"
          :key="dir"
          type="button"
          :aria-label="dir < 0 ? $t('common.prevPhoto') : $t('common.nextPhoto')"
          class="absolute top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-navy-950/80 text-ink-muted transition-colors hover:border-line-strong hover:text-ink md:grid"
          :class="dir < 0 ? 'left-5' : 'right-5'"
          @click="go(dir)"
        >
          <Icon
            :name="dir < 0 ? 'lucide:arrow-left' : 'lucide:arrow-right'"
            :size="18"
          />
        </button>
      </div>

      <div class="mx-auto w-full max-w-3xl px-6 pb-8 pt-2">
        <p
          v-if="current.eyebrow"
          class="eyebrow"
        >
          {{ current.eyebrow }}
        </p>
        <p class="mt-1.5 font-semibold text-ink">
          {{ current.title }}
        </p>
        <p
          v-if="current.text"
          class="mt-1.5 line-clamp-3 text-sm leading-relaxed text-ink-muted"
        >
          {{ current.text }}
        </p>
      </div>
    </div>
  </dialog>
</template>

<script lang="ts" setup>
/**
 * PhotoLightbox — full-screen photo viewer on a native <dialog>, so focus
 * trapping, Esc and the top layer come from the browser. Arrow keys and
 * horizontal swipes step through `items`; v-model:index opens (number) and
 * closes (null) it.
 */
export interface LightboxItem {
  src: string
  title: string
  eyebrow?: string
  text?: string
}

const props = defineProps<{
  items: LightboxItem[]
  index: number | null
}>()

const emit = defineEmits<{
  'update:index': [value: number | null]
}>()

const dialog = ref<HTMLDialogElement | null>(null)
const current = computed(() => (props.index === null ? null : props.items[props.index] ?? null))

function close() {
  dialog.value?.close()
}

function go(dir: number) {
  if (props.index === null) return
  const n = props.items.length
  emit('update:index', (props.index + dir + n) % n)
}

// Warm the cache for the neighbours so stepping feels instant.
function preload(i: number) {
  const n = props.items.length
  for (const j of [i - 1, i + 1]) {
    const item = props.items[(j + n) % n]
    if (item) new Image().src = item.src
  }
}

// Restored on close rather than cleared: the map's full screen may hold it too.
let pageOverflow = ''

watch(() => props.index, (i) => {
  const el = dialog.value
  if (!el) return
  if (i === null) {
    if (el.open) el.close()
    document.documentElement.style.overflow = pageOverflow
    return
  }
  if (!el.open) {
    el.showModal()
    pageOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
  }
  preload(i)
})

let swipeX: number | null = null
let swiped = false

function onSwipeStart(e: PointerEvent) {
  swiped = false
  swipeX = e.pointerType === 'mouse' ? null : e.clientX
}

function onSwipeEnd(e: PointerEvent) {
  if (swipeX === null) return
  const dx = e.clientX - swipeX
  swipeX = null
  if (Math.abs(dx) > 50) {
    swiped = true
    go(dx < 0 ? 1 : -1)
  }
}

function onBackdrop() {
  if (!swiped) close()
}

onBeforeUnmount(() => {
  if (dialog.value?.open) document.documentElement.style.overflow = pageOverflow
})
</script>
