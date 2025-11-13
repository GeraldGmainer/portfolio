<template>
  <div
      aria-live="polite"
      class="fixed inset-x-0 bottom-0 z-40 mx-auto mb-4 w-[min(100%,44rem)] rounded-2xl border border-orange-200/60 bg-white/95 p-4 shadow-lg backdrop-blur"
      role="dialog"
  >
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-sm leading-relaxed text-slate-700">
        Money Koi möchte anonymisierte Analytics-Daten erfassen, um die Website zu verbessern. Einverstanden?
      </p>
      <div class="flex shrink-0 gap-2">
        <button
            class="inline-flex items-center justify-center rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-orange-50 active:translate-y-px"
            @click="$emit('decline')"
        >
          Ablehnen
        </button>
        <button
            class="inline-flex items-center justify-center rounded-full bg-[#FF6F3D] px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-orange-200/70 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-px"
            @click="$emit('accept')"
        >
          Akzeptieren
        </button>
      </div>
    </div>
    <p class="mt-2 text-xs text-slate-500">
      Es werden keine personenbezogenen Daten gespeichert. Du kannst deine Entscheidung jederzeit in den Einstellungen zurücksetzen.
    </p>
  </div>
</template>

<script lang="ts" setup>
defineEmits<{ (e: 'accept'): void; (e: 'decline'): void }>()
</script>
