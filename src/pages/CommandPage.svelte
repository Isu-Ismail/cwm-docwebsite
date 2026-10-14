<script lang="ts">
  import DocsLayout from '../components/DocsLayout.svelte'
  import Link from '../components/Link.svelte'
  import Inline from '../components/Inline.svelte'
  import CodeBlock from '../components/CodeBlock.svelte'
  import Terminal from '../components/Terminal.svelte'
  import NotFound from './NotFound.svelte'
  import { commandOrder, commands } from '../lib/data'

  let { params }: { params: Record<string, string> } = $props()

  const cmd = $derived(commands[params.id])
  const pos = $derived(commandOrder.indexOf(params.id))
  const prev = $derived(pos > 0 ? commands[commandOrder[pos - 1]] : null)
  const next = $derived(pos >= 0 && pos < commandOrder.length - 1 ? commands[commandOrder[pos + 1]] : null)
</script>

{#if !cmd}
  <NotFound />
{:else}
  <DocsLayout>
    <article>
      <p class="font-mono text-xs text-muted">docs / {cmd.id}</p>
      <h1 class="mt-2 font-mono text-3xl font-bold tracking-tight">cwm {cmd.id}</h1>
      <p class="prose-cwm mt-3 max-w-2xl text-[17px] leading-relaxed text-muted"><Inline text={cmd.summary} /></p>

      <div class="mt-6">
        <CodeBlock code={cmd.syntax} prompt="$" />
        {#if cmd.alias}<p class="mt-2 font-mono text-xs text-muted">alias: <code class="text-fg">{cmd.alias}</code></p>{/if}
      </div>

      {#if cmd.notes.length}
        <section class="mt-12">
          <h2 class="font-mono text-sm text-muted">How it works</h2>
          <ul class="prose-cwm mt-4 flex max-w-2xl flex-col gap-3 text-[15px] leading-relaxed text-muted">
            {#each cmd.notes as n}
              <li class="relative pl-5 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-3 before:bg-accent"><Inline text={n} /></li>
            {/each}
          </ul>
        </section>
      {/if}

      {#if cmd.subcommands.length}
        <section class="mt-12">
          <h2 class="font-mono text-sm text-muted">Subcommands</h2>
          <dl class="mt-4 divide-y divide-line border-y border-line">
            {#each cmd.subcommands as s}
              <div class="grid gap-1 py-3 sm:grid-cols-[11rem_1fr] sm:gap-6">
                <dt class="font-mono text-[13px] text-fg">{cmd.id} {s.name}</dt>
                <dd class="prose-cwm text-sm text-muted"><Inline text={s.desc} /></dd>
              </div>
            {/each}
          </dl>
        </section>
      {/if}

      {#if cmd.flags.length}
        <section class="mt-12">
          <h2 class="font-mono text-sm text-muted">Flags</h2>
          <dl class="mt-4 divide-y divide-line border-y border-line">
            {#each cmd.flags as f}
              <div class="grid gap-1 py-3 sm:grid-cols-[14rem_1fr] sm:gap-6">
                <dt class="font-mono text-[13px] text-accent">{f.name}</dt>
                <dd class="prose-cwm text-sm text-muted"><Inline text={f.desc} /></dd>
              </div>
            {/each}
          </dl>
        </section>
      {/if}

      <section class="mt-12">
        <h2 class="font-mono text-sm text-muted">Examples</h2>
        <div class="mt-4 flex flex-col gap-8">
          {#each cmd.examples as ex}
            <div>
              <h3 class="mb-2 text-sm text-fg">{ex.title}</h3>
              <Terminal cmd={ex.cmd} output={ex.output} title="cwm {cmd.id}" />
            </div>
          {/each}
        </div>
      </section>

      <nav class="mt-16 grid grid-cols-2 gap-4 border-t border-line pt-6 font-mono text-sm" aria-label="Previous and next command">
        {#if prev}
          <Link to={`/docs/${prev.id}`} class="group flex flex-col gap-1 text-muted hover:text-fg"><span class="text-xs">← previous</span><span class="group-hover:text-accent">cwm {prev.id}</span></Link>
        {:else}<span></span>{/if}
        {#if next}
          <Link to={`/docs/${next.id}`} class="group flex flex-col items-end gap-1 text-right text-muted hover:text-fg"><span class="text-xs">next →</span><span class="group-hover:text-accent">cwm {next.id}</span></Link>
        {/if}
      </nav>
    </article>
  </DocsLayout>
{/if}
