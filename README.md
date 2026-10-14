# cwm docs (Svelte)

Documentation site for the `cwm` CLI. Svelte 5 + Vite + Tailwind CSS v4, written in TypeScript.
It replaces the vanilla site in `../cwm-docs`.

## Commands

```
pnpm install
pnpm dev        # dev server, client rendered
pnpm build      # client build + server bundle + prerender of every route into dist/
pnpm preview    # serve dist/ locally
pnpm check      # svelte-check + tsc
```

Deploying under a sub-path (GitHub Pages project site):

```
BASE=/cwm-docwebsite/ pnpm build
```

`VITE_SITE_URL` overrides the public origin used for canonical links and the sitemap (default is
`siteUrl` in `src/data/site.json`).

## How it is built

- **Routing:** a small History API router in `src/lib/router.svelte.ts` (browser routing, no
  hashes). Route table and per-route SEO meta are in `src/lib/routes.ts`.
- **Prerender:** `pnpm build` renders every route to its own `index.html` with its own `<title>`,
  description, canonical and Open Graph tags (`scripts/prerender.mjs`, `src/entry-server.ts`),
  then writes `sitemap.xml`, `robots.txt`, `404.html`. The browser hydrates that HTML.
  GitHub Pages serves `404.html` for unknown URLs, and the client router shows the not-found page.
- **Content is JSON, split into small files** under `src/data/`:

  | Folder / file | Content |
  | --- | --- |
  | `commands/<id>.json` | One file per command: summary, notes, flags, subcommands, examples with real captured output |
  | `nav.json` | Sidebar groups and command order |
  | `demo/NN-name.json` | Scenarios cycled in the home page terminal (sorted by `order`) |
  | `techniques/<id>.json` | One file per technique (one-liner and full script per OS) |
  | `features.json`, `site.json`, `downloads.json` | Home feature grid, site info and version, release files |

  Add a file in `commands/` and add its id to `nav.json` to publish a new command page.
- **Terminal output:** `cwm` prints plain text when piped, so `src/lib/terminal.ts` colours output by
  shape (headings, `Label:` keys, success and error lines).
- Inline copy in JSON supports only `` `code` `` and `**bold**` (`src/lib/inline.ts`). No raw HTML.

## Updating outputs

The outputs in `src/data/commands/*.json` were captured by running the real `cwm.exe` against a
throw-away home folder, with paths shortened to `C:\Users\you`. After a CLI change, re-run the
commands the same way and paste the new output into the matching JSON file.
