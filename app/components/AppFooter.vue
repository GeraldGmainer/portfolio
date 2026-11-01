<template>
  <footer class="border-t border-line bg-navy-950">
    <div class="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-20">
      <div class="grid gap-12 md:grid-cols-12 md:gap-8">
        <div class="md:col-span-5">
          <AppLogo class="text-2xl" />
          <p class="measure mt-4 text-sm leading-relaxed text-ink-muted">
            {{ $t('footer.tagline') }}
          </p>
          <ul class="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <li>
              <a
                class="link-underline text-ink-muted transition-colors hover:text-ink"
                href="https://github.com/GeraldGmainer"
                rel="noopener"
                target="_blank"
              >GitHub</a>
            </li>
            <li>
              <a
                class="link-underline text-ink-muted transition-colors hover:text-ink"
                href="https://www.linkedin.com/in/gerald-gmainer-7924552b1/"
                rel="noopener"
                target="_blank"
              >LinkedIn</a>
            </li>
            <li>
              <a
                class="link-underline text-ink-muted transition-colors hover:text-ink"
                :href="`mailto:${profile.email}`"
              >{{ profile.email }}</a>
            </li>
          </ul>
        </div>

        <nav
          :aria-label="$t('footer.nav')"
          class="md:col-span-3 md:col-start-7"
        >
          <UiEyebrow>{{ $t('footer.navigation') }}</UiEyebrow>
          <ul class="mt-4 space-y-2 text-sm">
            <li
              v-for="item in navItems"
              :key="item.to"
            >
              <NuxtLink
                :to="localePath(item.to)"
                class="text-ink-muted transition-colors hover:text-ink"
              >
                {{ $t(item.label) }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <div class="md:col-span-3">
          <UiEyebrow>{{ $t('footer.legal') }}</UiEyebrow>
          <ul class="mt-4 space-y-2 text-sm">
            <li>
              <NuxtLink
                :to="localePath('/legal/imprint')"
                class="text-ink-muted transition-colors hover:text-ink"
              >
                {{ $t('footer.imprint') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="localePath('/legal/privacy')"
                class="text-ink-muted transition-colors hover:text-ink"
              >
                {{ $t('footer.privacy') }}
              </NuxtLink>
            </li>
            <li>
              <button
                class="cursor-pointer text-left text-ink-muted transition-colors hover:text-ink"
                type="button"
                @click="reopen"
              >
                {{ $t('footer.usageData') }}
              </button>
            </li>
          </ul>
          <p class="mt-10 font-mono text-xs text-ink-faint">
            © {{ new Date().getFullYear() }} Gerald Gmainer
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { profile } from '~/data/profile'

const localePath = useLocalePath()
const { reopen } = useAnalyticsConsent()

const navItems = [
  { label: 'nav.about', to: '/about' },
  { label: 'nav.resume', to: '/resume' },
  { label: 'nav.projects', to: '/projects' },
  { label: 'nav.freelance', to: '/freelance' },
  { label: 'nav.blog', to: '/blog' },
  { label: 'nav.woodworking', to: '/woodworking' },
  { label: 'nav.japan', to: '/japan' },
  { label: 'nav.contact', to: '/contact' }
]
</script>
