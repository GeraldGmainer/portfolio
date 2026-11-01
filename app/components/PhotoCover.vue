<template>
  <div class="mb-5">
    <template v-if="photos.length">
      <button
        type="button"
        class="group relative block w-full overflow-hidden rounded border border-line"
        :aria-label="$t('common.viewPhotos', { name })"
        @click="emit('open', 0)"
      >
        <img
          :src="photos[0]"
          :alt="name"
          width="800"
          height="600"
          class="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out-soft group-hover:scale-[1.03]"
        >
        <span class="absolute right-2 top-2 inline-flex items-center gap-1 rounded bg-navy-950/80 px-1.5 py-1 font-mono text-[10px] text-ink">
          <Icon
            :name="photos.length > 1 ? 'lucide:images' : 'lucide:expand'"
            size="12"
          />
          <template v-if="photos.length > 1">{{ photos.length }}</template>
        </span>
      </button>
      <div
        v-if="photos.length > 1"
        class="mt-1.5 grid grid-cols-5 gap-1.5"
      >
        <button
          v-for="(src, i) in photos.slice(1, 6)"
          :key="src"
          type="button"
          :aria-label="$t('common.viewPhotoN', { n: i + 2 })"
          class="overflow-hidden rounded-sm border border-line transition-opacity hover:opacity-80"
          @click="emit('open', i + 1)"
        >
          <img
            :src="src"
            alt=""
            loading="lazy"
            class="aspect-square w-full object-cover"
          >
        </button>
      </div>
    </template>
    <PhotoStub
      v-else
      :name="name"
      class="aspect-[4/3] w-full rounded"
    />
  </div>
</template>

<script lang="ts" setup>
/** Cover photo with thumbnails of the rest, or a stub when there is none. */
defineProps<{
  photos: string[]
  name: string
}>()

const emit = defineEmits<{
  open: [index: number]
}>()
</script>
