// Header and footer stay mounted across client-side navigation, so the link
// that was clicked keeps focus on the new page and shows its focus ring on
// the next key press. Drop focus on page changes, like a full page load.
// Query-only changes (e.g. the projects filter) keep focus where it is.
export default defineNuxtPlugin(() => {
  useRouter().afterEach((to, from) => {
    if (to.path === from.path) return
    const el = document.activeElement
    if (el instanceof HTMLElement) el.blur()
  })
})
