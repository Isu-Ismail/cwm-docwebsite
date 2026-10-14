import { render } from 'svelte/server'
import App from './App.svelte'
import { match, allPaths } from './lib/routes'
import { setPath } from './lib/router.svelte'
import { canonicalFor, jsonLd, SITE_URL } from './lib/seo'
import { siteInfo } from './lib/data'

export { allPaths, SITE_URL }

/** Render one route to static HTML plus the head tags crawlers need. */
export function renderRoute(path: string) {
  setPath(path)
  const { meta } = match(path)
  const { body } = render(App)
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
  const ld = jsonLd(path)
  const head = [
    `<meta name="description" content="${esc(meta.description)}" />`,
    `<meta name="robots" content="${meta.noindex ? 'noindex' : 'index,follow'}" />`,
    `<link rel="canonical" href="${canonicalFor(path)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="cwm" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${canonicalFor(path)}" />`,
    `<meta name="twitter:card" content="summary" />`,
    ld ? `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>` : '',
  ]
    .filter(Boolean)
    .join('\n    ')
  return { html: body, head, title: meta.title, noindex: !!meta.noindex, name: siteInfo.name }
}
