<template>
  <header
    :class="[
      'fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300',
      !open && isScrolled ? 'border-line bg-navy-900/95' : 'border-transparent bg-transparent'
    ]"
  >
    <div class="relative z-10 mx-auto flex h-[72px] max-w-6xl items-center justify-between px-6 md:px-10">
      <AppLogo class="text-xl" />

      <nav
        :aria-label="$t('header.mainNav')"
        class="hidden items-center gap-7 whitespace-nowrap text-sm text-ink-muted lg:flex"
      >
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="localePath(item.to)"
          :class="{ 'is-active': isActive(item.to) }"
          class="nav-link border-b border-transparent pb-0.5 transition-colors duration-150 hover:text-ink"
        >
          {{ $t(item.label) }}
        </NuxtLink>
        <NuxtLink
          :to="localePath('/contact')"
          class="nav-contact rounded-md border border-line px-3.5 py-1.5 text-ink transition-colors duration-150 hover:border-line-strong"
          exact-active-class="is-active"
        >
          {{ $t('nav.contact') }}
        </NuxtLink>
        <NuxtLink
          :aria-label="$t('header.switchTo')"
          :hreflang="otherLocale"
          :lang="otherLocale"
          :to="otherLocaleLink"
          class="-ml-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint transition-colors duration-150 hover:text-ink"
        >
          {{ otherLocale }}
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-6 lg:hidden">
        <NuxtLink
          :aria-label="$t('header.switchTo')"
          :hreflang="otherLocale"
          :lang="otherLocale"
          :to="otherLocaleLink"
          class="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint transition-colors duration-150 hover:text-ink"
        >
          {{ otherLocale }}
        </NuxtLink>
        <button
          :aria-expanded="open"
          aria-controls="mobile-menu"
          class="font-mono text-[11px] uppercase tracking-[0.18em] text-ink"
          type="button"
          @click="toggle"
        >
          {{ open ? $t('header.close') : $t('header.menu') }}
        </button>
      </div>
    </div>

    <Transition name="menu">
      <div
        v-if="open"
        id="mobile-menu"
        class="fixed inset-0 z-0 flex flex-col bg-navy-950 pt-[72px] lg:hidden"
      >
        <nav
          :aria-label="$t('header.mobileNav')"
          class="flex-1 overflow-y-auto px-6 pt-4"
        >
          <ul>
            <li
              v-for="(item, index) in menuItems"
              :key="item.to"
              class="border-t border-line last:border-b"
            >
              <NuxtLink
                :to="localePath(item.to)"
                :class="{ 'is-active': isActive(item.to) }"
                class="menu-link flex items-baseline justify-between py-5 font-display text-4xl tracking-tight text-ink"
              >
                <span>{{ $t(item.label) }}</span>
                <span class="font-mono text-xs text-ink-faint">{{ String(index + 1).padStart(2, '0') }}</span>
              </NuxtLink>
            </li>
          </ul>
        </nav>
        <div class="flex flex-wrap gap-x-3 px-6 py-6 font-mono text-xs text-ink-faint">
          <a
            class="transition-colors hover:text-ink"
            :href="`mailto:${profile.email}`"
          >{{ profile.email }}</a>
          <span aria-hidden="true">·</span>
          <span>{{ $t('header.location') }}</span>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script lang="ts" setup>
import { profile } from '~/data/profile'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

// The logo links home, so the desktop bar leaves Home out to fit at lg.
const navItems = [
  { label: 'nav.about', to: '/about' },
  { label: 'nav.resume', to: '/resume' },
  { label: 'nav.projects', to: '/projects' },
  { label: 'nav.blog', to: '/blog' },
  { label: 'nav.woodworking', to: '/woodworking' },
  { label: 'nav.japan', to: '/japan' }
]
const menuItems = [{ label: 'nav.home', to: '/' }, ...navItems, { label: 'nav.contact', to: '/contact' }]

const route = useRoute()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const { locale } = useI18n()
const otherLocale = computed(() => (locale.value === 'de' ? 'en' : 'de'))

// The header renders before the page, so useSetI18nParams on a post comes too late
// for this link in the HTML. Posts with a translated slug are known from the build.
const blogAlternates: Record<string, Record<string, string>> = useRuntimeConfig().public.blogAlternates
const otherLocaleLink = computed(() => {
  const alternate = route.path.includes('/blog/')
    ? blogAlternates[String(route.params.slug)]?.[otherLocale.value]
    : undefined
  return alternate ? localePath(`/blog/${alternate}`, otherLocale.value) : switchLocalePath(otherLocale.value)
})

// Projects and the blog stay active on their detail pages.
const isActive = (to: string) => {
  const path = localePath(to)
  return to === '/' ? route.path === path : route.path === path || route.path.startsWith(`${path}/`)
}
const open = ref(false)
const toggle = () => {
  open.value = !open.value
}
const close = () => {
  open.value = false
}

watch(() => route.fullPath, close)

watch(open, (value) => {
  if (typeof document === 'undefined') return
  document.documentElement.style.overflow = value ? 'hidden' : ''
})

const isScrolled = ref(false)
const handleScroll = () => {
  isScrolled.value = window.scrollY > 24
}
const handleKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape') close()
}
const desktop = typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)') : null
const handleMedia = (event: MediaQueryListEvent) => {
  if (event.matches) close()
}

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('keydown', handleKey)
  desktop?.addEventListener('change', handleMedia)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleKey)
  desktop?.removeEventListener('change', handleMedia)
  document.documentElement.style.overflow = ''
})
</script>

<style scoped>
/* Active states live here so they win over the utility base classes. */
.nav-link.is-active {
  color: var(--color-ink);
  border-bottom-color: var(--color-accent);
}

.nav-contact.is-active {
  border-color: var(--color-accent);
}

.menu-link.is-active {
  color: var(--color-accent);
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
}

.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.2s ease;
}
</style>
