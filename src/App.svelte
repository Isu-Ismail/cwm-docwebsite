<script lang="ts">
  import Header from './components/Header.svelte'
  import Footer from './components/Footer.svelte'
  import { match } from './lib/routes'
  import { router } from './lib/router.svelte'
  import { canonicalFor } from './lib/seo'

  const current = $derived(match(router.path))
  const Page = $derived(current.component)

  // Keep title, description and robots in step with the route on client-side navigation.
  // The prerender step writes the same values into the static HTML for crawlers.
  $effect(() => {
    const { title, description, noindex } = current.meta
    document.title = title
    setMeta('name', 'description', description)
    setMeta('name', 'robots', noindex ? 'noindex' : 'index,follow')
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', canonicalFor(router.path))
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = canonicalFor(router.path)
  })

  function setMeta(attr: 'name' | 'property', key: string, value: string) {
    let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute(attr, key)
      document.head.appendChild(el)
    }
    el.content = value
  }
</script>

<a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-accent focus:px-3 focus:py-2 focus:font-mono focus:text-sm focus:text-bg">Skip to content</a>
<Header />
<main id="main">
  <Page params={current.params} />
</main>
<Footer />
