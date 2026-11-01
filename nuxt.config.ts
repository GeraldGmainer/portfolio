// https://nuxt.com/docs/api/configuration/nuxt-config
import { readdirSync, readFileSync, unwatchFile, watchFile } from 'node:fs'
import { join } from 'node:path'
import { caseStudies } from './app/data/projects'

// Canonical origin for canonical links, hreflang, the sitemap, llms.txt and JSON-LD.
// Switch to the own domain by setting NUXT_PUBLIC_SITE_URL on Vercel, once that
// domain is attached to the project and serves the site: from that build on, the
// old hostnames below redirect to it.
const VERCEL_HOST = 'geraldgmainer.vercel.app'
const siteUrl = (process.env.NUXT_PUBLIC_SITE_URL || `https://${VERCEL_HOST}`).replace(/\/$/, '')
const siteHost = new URL(siteUrl).host

const posts = ['de', 'en'].flatMap((locale) => {
  try {
    return readdirSync(`content/blog/${locale}`)
      .filter(file => file.endsWith('.md'))
      .map((file) => {
        const key = readFileSync(`content/blog/${locale}/${file}`, 'utf8').match(/^key:\s*(\S+)\s*$/m)?.[1]
        return { locale, key, slug: file.replace(/\.md$/, '') }
      })
  } catch {
    return []
  }
})

// Translations of a post under different slugs: slug → locale → that locale's slug.
const blogAlternates: Record<string, Record<string, string>> = {}
for (const post of posts) {
  const family = posts.filter(other => other.key === post.key)
  if (family.some(other => other.slug !== post.slug)) {
    blogAlternates[post.slug] = Object.fromEntries(family.map(other => [other.locale, other.slug]))
  }
}

// The markdown versions (server/middleware/markdown.ts): only llms.txt links to them,
// and the prerender crawl doesn't follow links in text files.
const markdownRoutes = [
  ...posts.map(post => `${post.locale === 'de' ? '' : '/en'}/blog/${post.slug}.md`),
  ...['', '/en'].flatMap(prefix => [
    `${prefix}/resume.md`,
    ...caseStudies.map(project => `${prefix}/projects/${project.caseStudy.slug}.md`)
  ])
]

// Routing on Vercel, ahead of the static files. Header rules use `continue` so the
// file is still served; nitro's own routeRules leave that out.
const vercelRoutes = [
  // One hostname per page, once the own domain is live. Preview URLs stay untouched.
  ...(siteHost === VERCEL_HOST
    ? []
    : [`www.${siteHost}`, VERCEL_HOST].map(value => ({
        src: '^/(.*)$',
        has: [{ type: 'host', value }],
        status: 308,
        headers: { Location: `${siteUrl}/$1` }
      }))),
  // One URL per page: /about/ is /about.
  { src: '^/(.+)/$', status: 308, headers: { Location: '/$1' } },
  // Images keep their names when replaced, so a week rather than immutable.
  {
    src: '^/images/(.*)$',
    headers: { 'cache-control': 'public, max-age=604800, stale-while-revalidate=2592000' },
    continue: true
  },
  // The PDF résumé ranks for the name; this hands its signals to the page.
  {
    src: '^/downloads/Lebenslauf_Gmainer_public\\.pdf$',
    headers: { Link: `<${siteUrl}/resume>; rel="canonical"` },
    continue: true
  }
]

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxt/icon',
    '@nuxtjs/i18n',
    // `nuxt prepare` (also run by `pnpm install`) and `nuxt typecheck` clear `.nuxt`
    // and regenerate the content files with no posts in them. A running dev server
    // picks that up and empties its content database, so /blog goes blank. Restart
    // it when that happens, which rebuilds the database from content/.
    (_options, nuxt) => {
      if (!nuxt.options.dev) return
      const manifest = join(nuxt.options.buildDir, 'content/manifest.ts')
      const emptied = () => {
        try {
          return readFileSync(manifest, 'utf8').includes('checksums = {}')
        } catch {
          return false
        }
      }
      watchFile(manifest, { interval: 1000 }, () => {
        if (emptied()) nuxt.callHook('restart')
      })
      nuxt.hook('close', () => unwatchFile(manifest))
    }
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  mdc: {
    highlight: {
      noApiRoute: false,
      theme: 'github-dark-default',
      langs: ['ts', 'js', 'vue', 'dart', 'java', 'kotlin', 'sql', 'json', 'yaml', 'bash', 'html', 'css']
    }
  },

  // No Nuxt UI component is in use; without this its CSS for all of them ships anyway.
  ui: {
    experimental: {
      componentDetection: true
    }
  },

  runtimeConfig: {
    public: {
      siteUrl,
      blogAlternates,
      // Only the production deployment may be indexed; previews get noindex.
      indexable: process.env.VERCEL_ENV ? process.env.VERCEL_ENV === 'production' : true
    }
  },

  compatibilityDate: '2025-01-15',

  nitro: {
    // Every page ships as static HTML. The crawl starts at both home pages and
    // follows the links, so a new page or post is included as soon as it's linked.
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/en',
        '/sitemap.xml',
        '/robots.txt',
        '/llms.txt',
        '/llms-full.txt',
        '/llms-full.de.txt',
        ...markdownRoutes,
        '/feed.xml',
        '/en/feed.xml'
      ]
    },
    vercel: {
      config: {
        routes: vercelRoutes
      }
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  // Only what the design uses. Without this every font ships in all weights, styles
  // and subsets: over 100 @font-face rules in the stylesheet that blocks first paint.
  fonts: {
    defaults: {
      subsets: ['latin', 'latin-ext']
    },
    families: [
      { name: 'Manrope', provider: 'google', weights: [400, 500, 600], styles: ['normal'] },
      { name: 'Fraunces', provider: 'google', weights: [400, 600], styles: ['normal', 'italic'] },
      { name: 'JetBrains Mono', provider: 'google', weights: [400, 500], styles: ['normal'] }
    ]
  },

  i18n: {
    baseUrl: siteUrl,
    defaultLocale: 'de',
    strategy: 'prefix_except_default',
    locales: [
      { code: 'de', language: 'de', name: 'Deutsch', file: 'de.json' },
      { code: 'en', language: 'en', name: 'English', file: 'en.json' }
    ],
    // No redirect: crawlers and shared links always get the language of the URL.
    detectBrowserLanguage: false
  },

  // Icons loaded on client-side navigation put their CSS in front of every other
  // stylesheet. In `components` (the Nuxt UI default) that declares the layer
  // before `base`, and Tailwind's reset then beats everything in `components`.
  icon: {
    cssLayer: 'base'
  }
})
