<template>
  <div class="grain min-h-screen bg-navy-900 text-ink antialiased">
    <AppHeader />
    <main>
      <NuxtPage />
    </main>
    <AppFooter />
    <AnalyticsConsent />
  </div>
</template>

<script lang="ts" setup>
import type { Locale } from '#shared/types/localized'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import AnalyticsConsent from './components/AnalyticsConsent.vue'
import { profile } from './data/profile'

const { siteUrl, indexable } = useRuntimeConfig().public
const { locale } = useI18n()

// lang, canonical, hreflang alternates, og:url and og:locale for the current page.
const i18nHead = useLocaleHead({ seo: true })

useHead(() => ({
  htmlAttrs: { lang: i18nHead.value.htmlAttrs?.lang },
  link: [
    { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
    { rel: 'manifest', href: '/site.webmanifest' },
    { rel: 'alternate', type: 'application/rss+xml', title: 'Blog – Gerald Gmainer', href: `${siteUrl}${locale.value === 'de' ? '' : `/${locale.value}`}/feed.xml` },
    { rel: 'describedby', type: 'text/plain', href: `${siteUrl}/llms.txt` },
    ...(i18nHead.value.link ?? [])
  ],
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
    { name: 'theme-color', content: '#0B1220' },
    { name: 'author', content: 'Gerald Gmainer' },
    { name: 'robots', content: indexable ? 'index, follow, max-image-preview:large, max-snippet:-1' : 'noindex, nofollow' },
    ...(i18nHead.value.meta ?? [])
  ],
  // Topic first, name second: search results cut long titles from the end.
  // A title that already fills the space goes without the name.
  titleTemplate: (t?: string) => {
    if (!t) return 'Gerald Gmainer'
    const full = `${t} | Gerald Gmainer`
    return full.length > 65 ? t : full
  }
}))

useSeoMeta({
  ogType: 'website',
  ogSiteName: 'Gerald Gmainer',
  twitterCard: 'summary_large_image',
  formatDetection: 'telephone=no'
})

// schema.org: who this site is about. Blog posts add their own BlogPosting.
useHead(() => ({
  script: [{
    key: 'person-schema',
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Person',
          '@id': `${siteUrl}/#person`,
          'name': profile.name,
          'givenName': profile.givenName,
          'familyName': profile.familyName,
          'url': siteUrl,
          'image': `${siteUrl}${profile.image}`,
          'email': `mailto:${profile.email}`,
          'description': profile.summary[locale.value as Locale],
          'jobTitle': profile.jobTitle[locale.value as Locale],
          'worksFor': { '@type': 'Organization', 'name': 'Hakara GmbH' },
          'alumniOf': { '@type': 'EducationalOrganization', 'name': 'HTL Steyr' },
          'hasCredential': {
            '@type': 'EducationalOccupationalCredential',
            'name': 'Certified Scrum Master',
            'credentialCategory': 'certificate'
          },
          'address': {
            '@type': 'PostalAddress',
            'addressLocality': 'Garsten',
            'addressRegion': 'Oberösterreich',
            'addressCountry': 'AT'
          },
          'knowsLanguage': ['de', 'en', 'ja'],
          'knowsAbout': [
            'Product Ownership', 'Scrum', 'UX/UI Design', 'SEO', 'Flutter', 'Dart', 'Offline-First',
            'Bluetooth Low Energy', 'Angular', 'Vue.js', 'Nuxt', 'React', 'TypeScript', 'Supabase',
            'PostgreSQL', 'Spring Boot', 'Java', 'Kotlin', 'Three.js', 'Unity'
          ],
          'sameAs': [profile.github, profile.linkedin]
        },
        {
          '@type': 'WebSite',
          '@id': `${siteUrl}/#website`,
          'url': siteUrl,
          'name': 'Gerald Gmainer',
          'inLanguage': ['de', 'en'],
          'publisher': { '@id': `${siteUrl}/#person` }
        }
      ]
    })
  }]
}))
</script>
