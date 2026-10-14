import type { Component } from 'svelte'
import Home from '../pages/Home.svelte'
import DocsIndex from '../pages/DocsIndex.svelte'
import CommandPage from '../pages/CommandPage.svelte'
import Install from '../pages/Install.svelte'
import Techniques from '../pages/Techniques.svelte'
import TechniquePage from '../pages/TechniquePage.svelte'
import NotFound from '../pages/NotFound.svelte'
import { commandOrder, commands, siteInfo, techniques } from './data'

export interface Meta {
  title: string
  description: string
  noindex?: boolean
}

interface Route {
  pattern: string
  component: Component<any>
  /** Every concrete path this route renders. Used for prerendering and the sitemap. */
  paths: () => string[]
  meta: (params: Record<string, string>) => Meta | null
}

const routes: Route[] = [
  {
    pattern: '/',
    component: Home,
    paths: () => ['/'],
    meta: () => ({ title: `cwm: ${siteInfo.tagline}`, description: siteInfo.description }),
  },
  {
    pattern: '/install',
    component: Install,
    paths: () => ['/install'],
    meta: () => ({
      title: 'Install cwm for Windows, Linux and macOS',
      description: `Download cwm ${siteInfo.version} as a zip, deb, rpm or tar.gz and run one command to install it.`,
    }),
  },
  {
    pattern: '/docs',
    component: DocsIndex,
    paths: () => ['/docs'],
    meta: () => ({
      title: 'cwm documentation: every command',
      description:
        'Reference for all cwm commands with flags and real terminal output: save, get, clear, watch, tidy, config, bank, setup, hello.',
    }),
  },
  {
    pattern: '/docs/:id',
    component: CommandPage,
    paths: () => commandOrder.map((id) => `/docs/${id}`),
    meta: ({ id }) => {
      const c = commands[id]
      return c ? { title: `cwm ${c.id}: ${c.summary}`, description: `${c.summary} Syntax: ${c.syntax}` } : null
    },
  },
  {
    pattern: '/techniques',
    component: Techniques,
    paths: () => ['/techniques'],
    meta: () => ({
      title: 'cwm techniques: ready-made saved commands',
      description: 'Copy-paste saved commands and scripts for cwm, with one version per operating system.',
    }),
  },
  {
    pattern: '/techniques/:id',
    component: TechniquePage,
    paths: () => techniques.map((t) => `/techniques/${t.id}`),
    meta: ({ id }) => {
      const t = techniques.find((x) => x.id === id)
      return t ? { title: `${t.name}: a cwm technique`, description: t.description } : null
    },
  },
]

export interface Match {
  component: Component<any>
  params: Record<string, string>
  meta: Meta
}

export const notFoundMeta: Meta = { title: 'Page not found | cwm', description: 'This page does not exist.', noindex: true }

export function match(path: string): Match {
  for (const r of routes) {
    const names: string[] = []
    const re = new RegExp(
      '^' +
        r.pattern.replace(/:([a-z]+)/g, (_, n: string) => {
          names.push(n)
          return '([^/]+)'
        }) +
        '$',
    )
    const m = re.exec(path)
    if (!m) continue
    const params = Object.fromEntries(names.map((n, i) => [n, decodeURIComponent(m[i + 1])]))
    const meta = r.meta(params)
    if (meta) return { component: r.component, params, meta }
  }
  return { component: NotFound, params: {}, meta: notFoundMeta }
}

export const allPaths = (): string[] => routes.flatMap((r) => r.paths())
