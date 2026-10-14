<script lang="ts">
  import Link from './Link.svelte'
  import Logo from './Logo.svelte'
  import ThemeToggle from './ThemeToggle.svelte'
  import { siteInfo } from '../lib/data'

  const links = [
    { to: '/', label: 'Home', exact: true },
    { to: '/docs', label: 'Docs' },
    { to: '/techniques', label: 'Techniques' },
    { to: '/install', label: 'Install' },
  ]
</script>

<header class="sticky top-0 z-20 border-b border-line bg-bg/90 backdrop-blur">
  <div class="mx-auto flex h-14 max-w-[100rem] items-center gap-4 px-4 sm:px-8 lg:px-12">
    <Link to="/" exact class="flex items-center gap-2.5 font-mono text-[15px] font-bold tracking-tight text-fg">
      <Logo size={26} />
      <span>cwm</span>
    </Link>
    <span class="hidden rounded border border-line px-1.5 py-0.5 font-mono text-[11px] text-muted sm:inline">{siteInfo.version}</span>

    <nav class="ml-auto flex items-center gap-0 sm:gap-2" aria-label="Main">
      {#each links as l}
        <Link to={l.to} exact={l.exact} class="rounded px-2 py-1.5 font-mono text-[13px] text-muted transition-colors hover:text-fg aria-[current=page]:text-fg aria-[current=page]:underline aria-[current=page]:decoration-accent aria-[current=page]:underline-offset-8">
          {l.label}
        </Link>
      {/each}
      <a
        href={siteInfo.repo}
        rel="noopener"
        class="hidden rounded px-2.5 py-1.5 font-mono text-[13px] text-muted transition-colors hover:text-fg sm:inline"
      >
        GitHub
      </a>
      <ThemeToggle />
    </nav>
  </div>
</header>
