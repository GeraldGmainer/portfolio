// v-reveal: fades and lifts an element in when it scrolls into view.
// Registered on both server and client so SSR does not warn; the
// behaviour itself only runs in the browser.
export default defineNuxtPlugin((nuxtApp) => {
  let io: IntersectionObserver | null = null
  let reduced = false

  const observer = () => {
    if (!io) {
      io = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io?.unobserve(entry.target)
          }
        }
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0 })
    }
    return io
  }

  nuxtApp.vueApp.directive('reveal', {
    getSSRProps() {
      return {}
    },
    mounted(el: HTMLElement) {
      if (typeof window === 'undefined') return
      reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      el.classList.add('reveal')
      if (reduced) {
        el.classList.add('is-visible')
        return
      }
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('is-visible')
        return
      }
      observer().observe(el)
    },
    unmounted(el: HTMLElement) {
      io?.unobserve(el)
    }
  })
})
