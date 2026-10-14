<script lang="ts">
  import Link from '../components/Link.svelte'
  import HeroTerminal from '../components/HeroTerminal.svelte'
  import CodeBlock from '../components/CodeBlock.svelte'
  import { featureList, siteInfo } from '../lib/data'

  const steps = [
    { n: '1', title: 'Install and check', text: 'One file. Unzip it, put it on your PATH, and check that it runs.', code: 'cwm hello', prompt: '$', link: '/install', linkText: 'Install guide' },
    { n: '2', title: 'Turn on shell integration', text: 'Adds one block to your profile so saved commands run in your current shell.', code: 'cwm setup', prompt: '$' },
    { n: '3', title: 'Save something you retype', text: 'Give a long command a short name. Run it with -x.', code: 'cwm save gs "git status -sb" && cwm get gs -x', prompt: '$' },
  ]
</script>

<section class="mx-auto grid max-w-[100rem] grid-cols-1 gap-10 px-4 pb-16 pt-14 sm:px-8 lg:grid-cols-[minmax(0,28rem)_minmax(0,1fr)] lg:items-stretch lg:gap-14 lg:px-12 lg:pt-20">
  <div>
    <p class="mb-5 font-mono text-xs text-muted">{siteInfo.version} · Go · one binary · SQLite</p>
    <h1 class="font-mono text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
      Stop retyping<br /><span class="text-accent">commands.</span>
    </h1>
    <p class="mt-5 max-w-md text-[17px] leading-relaxed text-muted">
      {siteInfo.description}
    </p>
    <div class="mt-8 flex flex-wrap gap-3">
      <Link to="/install" class="rounded bg-accent px-4 py-2.5 font-mono text-sm font-bold text-bg transition-opacity hover:opacity-90">Install cwm</Link>
      <Link to="/docs" class="rounded border border-line px-4 py-2.5 font-mono text-sm text-fg transition-colors hover:border-muted">Read the docs</Link>
    </div>
    <dl class="mt-10 flex max-w-md flex-wrap gap-x-8 gap-y-4 border-t border-line pt-6 font-mono text-xs">
      <div><dt class="text-muted">Platforms</dt><dd class="mt-1 text-fg">Win · Linux · Mac</dd></div>
      <div><dt class="text-muted">Storage</dt><dd class="mt-1 text-fg">~/.cwm/cwm.db</dd></div>
      <div><dt class="text-muted">Cloud</dt><dd class="mt-1 text-fg">None</dd></div>
    </dl>
  </div>
  <HeroTerminal />
</section>

<section class="border-y border-line bg-panel/40">
  <div class="mx-auto max-w-[100rem] px-4 py-16 sm:px-8 lg:px-12">
    <h2 class="font-mono text-sm text-muted">What it does</h2>
    <div class="mt-6 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
      {#each featureList as f}
        <article class="flex flex-col gap-3 bg-bg p-6">
          <h3 class="font-mono text-[15px] font-bold">{f.title}</h3>
          <p class="flex-1 text-sm leading-relaxed text-muted">{f.text}</p>
          <code class="truncate font-mono text-xs text-accent">$ {f.cmd}</code>
        </article>
      {/each}
    </div>
  </div>
</section>

<section class="mx-auto max-w-[100rem] px-4 py-16 sm:px-8 lg:px-12">
  <h2 class="font-mono text-sm text-muted">Start in three steps</h2>
  <ol class="mt-6 grid gap-6 lg:grid-cols-3">
    {#each steps as s}
      <li class="flex flex-col gap-3">
        <div class="flex items-baseline gap-3">
          <span class="font-mono text-xs text-accent">{s.n}</span>
          <h3 class="font-mono text-[15px] font-bold">{s.title}</h3>
        </div>
        <p class="text-sm leading-relaxed text-muted">{s.text}</p>
        <CodeBlock code={s.code} prompt={s.prompt} />
        {#if s.link}<Link to={s.link} class="font-mono text-xs text-accent hover:underline">{s.linkText} →</Link>{/if}
      </li>
    {/each}
  </ol>
</section>
