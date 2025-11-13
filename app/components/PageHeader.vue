<template>
  <header
      class="relative overflow-hidden"
      :class="[
      border ? 'border-b border-orange-50' : '',
      'bg-gradient-to-b',
      `from-[${from}]`,
      `to-[${to}]`
    ]"
  >
    <div v-if="blob" class="pointer-events-none absolute inset-0 -z-10">
      <div class="mx-auto h-[35vh] max-w-6xl blur-2xl">
        <div class="mx-6 mt-10 h-full rounded-[40px] bg-[radial-gradient(1200px_500px_at_50%_-20%,#FFE6D7_0%,transparent_60%)]"></div>
      </div>
    </div>

    <div class="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <p
          v-if="eyebrow"
          class="text-xs font-semibold uppercase tracking-[0.25em] text-orange-400 opacity-0 translate-y-4 transition-all duration-700 data-[inview=true]:opacity-100 data-[inview=true]:translate-y-0"
          :class="alignClass"
          data-reveal
      >
        {{ eyebrow }}
      </p>

      <h1
          class="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl opacity-0 translate-y-4 transition-all duration-700 delay-100 data-[inview=true]:opacity-100 data-[inview=true]:translate-y-0"
          :class="alignClass"
          data-reveal
      >
        {{ title }}
      </h1>

      <p
          v-if="subtitle"
          class="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 lg:text-base opacity-0 translate-y-4 transition-all duration-700 delay-200 data-[inview=true]:opacity-100 data-[inview=true]:translate-y-0"
          :class="[alignClass, align === 'center' ? 'mx-auto' : '']"
          data-reveal
      >
        {{ subtitle }}
      </p>
    </div>
  </header>
</template>

<script setup>
const props = defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  align: { type: String, default: 'left' },
  from: { type: String, default: '#FFFDF8' },
  to: { type: String, default: '#FFF6EB' },
  blob: { type: Boolean, default: true },
  border: { type: Boolean, default: true }
})

const alignClass = computed(() => (props.align === 'center' ? 'text-center' : 'text-left'))

const observe = () => {
  const els = document.querySelectorAll('[data-reveal]')
  const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.setAttribute('data-inview', 'true')
            io.unobserve(e.target)
          }
        }
      },
      { threshold: 0.2 }
  )
  els.forEach(el => io.observe(el))
}

onMounted(() => observe())
</script>
