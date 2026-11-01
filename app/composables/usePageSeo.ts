import type { Localized } from '#shared/types/localized'

type Text = string | Localized

export type PageSeo = {
  // Shown as "<title> | Gerald Gmainer". `null` means the home page, which uses ogTitle as it is.
  title: Text | null
  description: Text
  ogTitle?: Text
  image?: { src: string, width?: number, height?: number }
  // For pages that don't belong in search results (legal). Also leaves out the JSON-LD.
  noindex?: boolean
  // This page has a clean markdown version at the same URL plus `.md` (see server/middleware/markdown.ts).
  markdown?: boolean
  // schema.org type of the page, plus anything to add to that node.
  pageType?: string
  page?: Record<string, unknown>
  // The trail after Home. The last entry is this page and needs no `to`.
  crumbs?: { name: Text, to?: string }[]
  // More schema.org nodes for this page, e.g. the BlogPosting.
  schema?: (ctx: { url: string, abs: (path: string) => string, personId: string, websiteId: string }) => Record<string, unknown>[]
}

/**
 * Title, description, social tags and JSON-LD for one page. Canonical, hreflang
 * and og:url come from useLocaleHead in app.vue.
 */
export function usePageSeo(meta: PageSeo) {
  const { locale } = useI18n()
  const l = useLocalized()
  const localePath = useLocalePath()
  const route = useRoute()
  const { siteUrl } = useRuntimeConfig().public

  const text = (value: Text) => (typeof value === 'string' ? value : l(value))
  const fullTitle = () => {
    if (meta.ogTitle) return text(meta.ogTitle)
    return meta.title ? `${text(meta.title)} | Gerald Gmainer` : 'Gerald Gmainer'
  }
  const description = () => text(meta.description)

  const abs = (path: string) => `${siteUrl}${path}`
  const image = () => abs(meta.image?.src ?? `/images/og/default.${locale.value}.jpg`)
  const imageWidth = meta.image ? meta.image.width : 1200
  const imageHeight = meta.image ? meta.image.height : 630

  useHead(() => ({
    // The home page has no topic to put in front of the name, so it skips the template.
    title: meta.title ? text(meta.title) : fullTitle(),
    ...(meta.title ? {} : { titleTemplate: '%s' }),
    link: meta.markdown ? [{ rel: 'alternate', type: 'text/markdown', href: abs(`${route.path}.md`) }] : []
  }))

  useSeoMeta({
    description,
    ogTitle: fullTitle,
    ogDescription: description,
    ogImage: image,
    ogImageWidth: imageWidth,
    ogImageHeight: imageHeight,
    ogImageAlt: fullTitle,
    twitterTitle: fullTitle,
    twitterDescription: description,
    twitterImage: image,
    twitterImageAlt: fullTitle,
    ...(meta.noindex ? { robots: 'noindex, follow' } : {})
  })

  if (meta.noindex) return

  useHead(() => {
    const url = abs(route.path)
    const personId = `${siteUrl}/#person`
    const websiteId = `${siteUrl}/#website`

    const crumbs = meta.crumbs ?? []
    const trail = [
      { name: 'Home', to: '/' },
      ...crumbs.map(c => ({ name: text(c.name), to: c.to }))
    ]

    return {
      script: [{
        key: 'page-schema',
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': meta.pageType ?? 'WebPage',
              '@id': `${url}#webpage`,
              url,
              'name': fullTitle(),
              'description': description(),
              'inLanguage': locale.value,
              'isPartOf': { '@id': websiteId },
              'about': { '@id': personId },
              'primaryImageOfPage': image(),
              ...(crumbs.length ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
              ...meta.page
            },
            ...(crumbs.length
              ? [{
                  '@type': 'BreadcrumbList',
                  '@id': `${url}#breadcrumb`,
                  'itemListElement': trail.map((c, i) => ({
                    '@type': 'ListItem',
                    'position': i + 1,
                    'name': c.name,
                    // Google takes the last item's URL from the page itself.
                    ...(i < trail.length - 1 && c.to ? { item: abs(localePath(c.to)) } : {})
                  }))
                }]
              : []),
            ...(meta.schema?.({ url, abs, personId, websiteId }) ?? [])
          ]
        })
      }]
    }
  })
}
