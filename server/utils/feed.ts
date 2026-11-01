import type { H3Event } from 'h3'
import type { Locale } from '../../shared/types/localized'

const escapeXml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')

const COPY = {
  de: { title: 'Gerald Gmainer – Blog', description: 'Flutter, Offline-First, Supabase und Product Ownership – aus echten Projekten.', language: 'de' },
  en: { title: 'Gerald Gmainer – Blog', description: 'Flutter, offline-first, Supabase and product ownership – from real projects.', language: 'en' }
} satisfies Record<Locale, { title: string, description: string, language: string }>

/** RSS 2.0 for one language: /feed.xml and /en/feed.xml. */
export async function renderFeed(event: H3Event, locale: Locale) {
  const { siteUrl } = useRuntimeConfig(event).public
  const posts = (await loadPosts(event)).filter(p => p.locale === locale)
  const self = `${siteUrl}${localizedPath('/feed.xml', locale)}`
  const copy = COPY[locale]

  setHeader(event, 'content-type', 'application/rss+xml; charset=utf-8')
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(copy.title)}</title>`,
    `    <link>${siteUrl}${localizedPath('/blog', locale)}</link>`,
    `    <description>${escapeXml(copy.description)}</description>`,
    `    <language>${copy.language}</language>`,
    ...(posts[0] ? [`    <lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>`] : []),
    `    <atom:link href="${self}" rel="self" type="application/rss+xml"/>`,
    ...posts.flatMap(post => [
      '    <item>',
      `      <title>${escapeXml(post.title)}</title>`,
      `      <link>${siteUrl}${post.url}</link>`,
      `      <guid isPermaLink="true">${siteUrl}${post.url}</guid>`,
      `      <description>${escapeXml(post.description)}</description>`,
      `      <pubDate>${new Date(post.date).toUTCString()}</pubDate>`,
      ...(post.tags ?? []).map(tag => `      <category>${escapeXml(tag)}</category>`),
      '    </item>'
    ]),
    '  </channel>',
    '</rss>'
  ].join('\n')
}
