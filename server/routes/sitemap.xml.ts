import { caseStudies } from '../../app/data/projects'

// Every indexable page in both languages, linked as hreflang alternates. Legal
// pages are noindex, so they stay out. Prerendered at build time, so new blog
// posts appear with the next deploy.
const PAGES = [
  '/',
  '/about',
  '/resume',
  '/freelance',
  '/projects',
  ...caseStudies.map(p => `/projects/${p.caseStudy.slug}`),
  '/blog',
  '/contact',
  '/woodworking',
  '/japan'
]

const IMAGES: Record<string, string[]> = Object.fromEntries(
  caseStudies.map(p => [`/projects/${p.caseStudy.slug}`, p.caseStudy.images.map(img => img.src)])
)

type Entry = { loc: string, lastmod?: string, images: string[], alternates: { lang: string, href: string }[] }

export default defineEventHandler(async (event) => {
  const { siteUrl } = useRuntimeConfig(event).public
  const abs = (path: string) => `${siteUrl}${path}`
  const entries: Entry[] = []

  for (const path of PAGES) {
    const alternates = [
      ...(['de', 'en'] as const).map(lang => ({ lang, href: abs(localizedPath(path, lang)) })),
      { lang: 'x-default', href: abs(path) }
    ]
    for (const lang of ['de', 'en'] as const) {
      entries.push({ loc: abs(localizedPath(path, lang)), images: (IMAGES[path] ?? []).map(abs), alternates })
    }
  }

  const posts = await loadPosts(event)

  for (const post of posts) {
    const family = posts.filter(other => other.key === post.key)
    const german = family.find(other => other.locale === 'de')
    entries.push({
      loc: abs(post.url),
      lastmod: post.lastmod,
      images: [abs(post.cover)],
      alternates: family.length > 1
        ? [
            ...family.map(other => ({ lang: other.locale as string, href: abs(other.url) })),
            ...(german ? [{ lang: 'x-default', href: abs(german.url) }] : [])
          ]
        : []
    })
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ...entries.map(e => [
      '  <url>',
      `    <loc>${e.loc}</loc>`,
      ...(e.lastmod ? [`    <lastmod>${e.lastmod}</lastmod>`] : []),
      ...e.alternates.map(alt => `    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${alt.href}"/>`),
      ...e.images.map(src => `    <image:image><image:loc>${src}</image:loc></image:image>`),
      '  </url>'
    ].join('\n')),
    '</urlset>'
  ].join('\n')

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return xml
})
