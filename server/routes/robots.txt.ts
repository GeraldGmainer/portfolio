// Production allows everything, AI crawlers included, and points to the sitemap;
// preview deployments (VERCEL_ENV=preview, see runtimeConfig.public.indexable)
// block all crawlers.
export default defineEventHandler((event) => {
  const { siteUrl, indexable } = useRuntimeConfig(event).public
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return indexable
    ? `User-agent: *\nAllow: /\n\n# For language models: ${siteUrl}/llms.txt\nSitemap: ${siteUrl}/sitemap.xml\n`
    : 'User-agent: *\nDisallow: /\n'
})
