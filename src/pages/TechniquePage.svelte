<script lang="ts">
  import Link from '../components/Link.svelte'
  import CodeBlock from '../components/CodeBlock.svelte'
  import Copy from '../components/Copy.svelte'
  import NotFound from './NotFound.svelte'
  import { techniques } from '../lib/data'

  let { params }: { params: Record<string, string> } = $props()

  const t = $derived(techniques.find((x) => x.id === params.id))
  const osLabel: Record<string, string> = { windows: 'Windows', linux: 'Linux', mac: 'macOS' }

  let os = $state('windows')
  let view = $state<'oneliner' | 'script'>('oneliner')

  const systems = $derived(t ? Object.keys(t.systems) : [])
  const text = $derived(t ? (view === 'oneliner' ? t.systems[os] : t.scripts[os]) ?? '' : '')

  const tab = (on: boolean) =>
    `cursor-pointer rounded border px-3 py-1.5 font-mono text-xs transition-colors ${on ? 'border-accent text-accent' : 'border-line text-muted hover:border-muted hover:text-fg'}`
</script>

{#if !t}
  <NotFound />
{:else}
  <section class="mx-auto max-w-5xl px-4 py-12 sm:px-8 lg:px-12">
    <p class="font-mono text-xs text-muted"><Link to="/techniques" class="hover:text-fg">techniques</Link> / {t.id}</p>
    <h1 class="mt-2 font-mono text-3xl font-bold tracking-tight">{t.name}</h1>
    <p class="mt-3 max-w-2xl text-[17px] leading-relaxed text-muted">{t.description}</p>
    <p class="mt-3 flex gap-2 font-mono text-[11px] text-muted">{#each t.tags as tag}<span class="rounded border border-line px-1.5 py-0.5">{tag}</span>{/each}</p>

    <div class="mt-8 flex flex-wrap gap-6">
      <div class="flex gap-1.5" role="tablist" aria-label="Operating system">
        {#each systems as s}
          <button type="button" role="tab" aria-selected={os === s} class={tab(os === s)} onclick={() => (os = s)}>{osLabel[s] ?? s}</button>
        {/each}
      </div>
      <div class="flex gap-1.5" role="tablist" aria-label="Version">
        <button type="button" role="tab" aria-selected={view === 'oneliner'} class={tab(view === 'oneliner')} onclick={() => (view = 'oneliner')}>One-liner</button>
        <button type="button" role="tab" aria-selected={view === 'script'} class={tab(view === 'script')} onclick={() => (view = 'script')}>Full script</button>
      </div>
    </div>

    <p class="mt-4 text-sm text-muted">
      {#if view === 'oneliner'}Paste this in your terminal. It saves the command as <code class="font-mono text-[0.85em] text-fg">{t.name}</code>.{:else}The full script, in case you prefer <code class="font-mono text-[0.85em] text-fg">cwm save -s {t.name}</code> and pasting it into the editor.{/if}
    </p>

    <div class="mt-3 overflow-hidden rounded-md border border-line bg-panel">
      <div class="flex items-center justify-between border-b border-line px-4 py-2">
        <span class="font-mono text-[11px] text-muted">{osLabel[os] ?? os}</span>
        <Copy text={text} />
      </div>
      <pre class="max-h-[32rem] overflow-auto px-4 py-3 font-mono text-[12.5px] leading-6 text-fg"><code>{text}</code></pre>
    </div>

    <div class="mt-8">
      <h2 class="mb-3 font-mono text-sm text-muted">Then run it</h2>
      <CodeBlock code={`cwm get ${t.name} -x`} prompt="$" />
    </div>
  </section>
{/if}
