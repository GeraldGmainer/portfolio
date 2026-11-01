export default defineEventHandler(async (event) => {
  const { siteUrl } = useRuntimeConfig(event).public
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return llmsFull(event, 'de', siteUrl)
})
