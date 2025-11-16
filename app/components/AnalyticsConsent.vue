<template>
  <div
      aria-live="polite"
      class="fixed inset-x-0 bottom-0 z-40 mx-auto mb-5 w-[min(100%,44rem)] rounded-2xl border border-white/10 bg-[#0B1220]/90 p-5 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
      role="dialog"
  >
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-sm leading-relaxed text-slate-200">
        Ich möchte anonyme Nutzungsdaten erfassen, um die Website zu verbessern. Einverstanden?
      </p>

      <div class="flex shrink-0 gap-2">
        <button
            class="inline-flex items-center justify-center rounded-full bg-white/10 px-5 py-2 text-sm font-medium text-slate-200 ring-1 ring-white/10 transition hover:bg-white/15 active:translate-y-px"
            @click="$emit('decline')"
        >
          Ablehnen
        </button>

        <button
            class="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-5 py-2 text-sm font-semibold text-white shadow-[0_0_14px_rgba(56,189,248,0.4)] transition hover:-translate-y-0.5 hover:shadow-[0_0_22px_rgba(56,189,248,0.6)] active:translate-y-px"
            @click="$emit('accept')"
        >
          Akzeptieren
        </button>
      </div>
    </div>

    <p class="mt-2 text-xs text-slate-400">
      Es werden keine personenbezogenen Daten gespeichert. Die Entscheidung kann jederzeit zurückgesetzt werden.
    </p>
  </div>
</template>

<script lang="ts" setup>
defineEmits<{ (e: 'accept'): void; (e: 'decline'): void }>()
</script>
