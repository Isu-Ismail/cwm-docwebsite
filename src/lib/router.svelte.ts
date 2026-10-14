// Tiny History API router. Paths in the app never include the deploy base (/<repo>).
export const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

export const router = $state({ path: '/' })

/** Strip base, query, hash and trailing slash. '/docs/save/' -> '/docs/save'. */
export function normalize(raw: string): string {
  let p = raw.split('#')[0].split('?')[0]
  if (BASE && p.startsWith(BASE)) p = p.slice(BASE.length)
  if (!p.startsWith('/')) p = '/' + p
  if (p.length > 1 && p.endsWith('/')) p = p.replace(/\/+$/, '')
  return p || '/'
}

/** Real URL for an app path. Trailing slash matches how GitHub Pages serves folders. */
export function href(path: string): string {
  return BASE + (path === '/' ? '/' : path + '/')
}

export function setPath(path: string) {
  router.path = normalize(path)
}

export function initRouter() {
  setPath(location.pathname)
  addEventListener('popstate', () => setPath(location.pathname))
}

export function navigate(to: string) {
  const next = normalize(to)
  if (next === router.path) return
  history.pushState({}, '', href(next))
  router.path = next
  scrollTo({ top: 0, behavior: 'instant' })
}
