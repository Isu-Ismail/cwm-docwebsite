import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// BASE: sub-path the site is served from. GitHub Pages project sites live under /<repo>/.
// SITE_URL: origin + base, used for canonical links and the sitemap.
export default defineConfig({
  base: process.env.BASE ?? '/',
  plugins: [tailwindcss(), svelte()],
})
