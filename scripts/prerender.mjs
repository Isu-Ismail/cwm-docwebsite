// Turns the client build into static HTML for every route, so crawlers and no-JS visitors
// get real content and per-page <title>/<meta>. Also writes sitemap.xml, robots.txt and 404.html.
// Runs after `vite build` (client) and `vite build --ssr` (server bundle in dist-ssr).
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const ssrDir = join(root, 'dist-ssr')

const ssrEntry = (await readdir(ssrDir)).find((f) => /^entry-server\.m?js$/.test(f))
if (!ssrEntry) throw new Error('dist-ssr/entry-server.js not found. Run `vite build --ssr src/entry-server.ts --outDir dist-ssr` first.')
const { renderRoute, allPaths, SITE_URL } = await import(pathToFileURL(join(ssrDir, ssrEntry)).href)

const template = await readFile(join(dist, 'index.html'), 'utf8')
for (const marker of ['<!--app-head-->', '<!--app-html-->']) {
  if (!template.includes(marker)) throw new Error(`dist/index.html lost the ${marker} placeholder`)
}

const escHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

function page(path) {
  const r = renderRoute(path)
  return template
    .replace(/<title>.*?<\/title>/, `<title>${escHtml(r.title)}</title>`)
    .replace('<!--app-head-->', r.head)
    .replace('<!--app-html-->', r.html)
}

const paths = allPaths()
for (const p of paths) {
  const file = p === '/' ? join(dist, 'index.html') : join(dist, p, 'index.html')
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, page(p))
}

// GitHub Pages serves 404.html for unknown URLs. The client router renders NotFound there.
await writeFile(join(dist, '404.html'), page('/__not-found__'))

const today = new Date().toISOString().slice(0, 10)
const urls = paths
  .map((p) => `  <url><loc>${SITE_URL}${p === '/' ? '/' : p + '/'}</loc><lastmod>${today}</lastmod></url>`)
  .join('\n')
await writeFile(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
)
await writeFile(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)
await writeFile(join(dist, '.nojekyll'), '')

// The content JSON files are bundled into the JS, and also published as plain files
// (dist/data/commands/save.json ...) so other tools and the CLI can read them.
await cp(join(root, 'src', 'data'), join(dist, 'data'), { recursive: true })

await rm(ssrDir, { recursive: true, force: true })
console.log(`prerendered ${paths.length} pages + 404.html, sitemap.xml, robots.txt`)
