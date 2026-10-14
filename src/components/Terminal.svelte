<script lang="ts">
  import { styleOutput, type Line } from '../lib/terminal'

  let {
    cmd,
    output,
    typed = cmd.length,
    showOutput = true,
    cursor = false,
    title = 'terminal',
  }: { cmd: string; output: string; typed?: number; showOutput?: boolean; cursor?: boolean; title?: string } = $props()

  const lines = $derived(styleOutput(output))
  // Pixel-art rows (ANSI coloured half blocks) need tight line spacing so the blocks join up.
  // Split the output into runs of normal rows and art rows, each run in its own <pre>.
  const isArt = (l: Line) => l.some((p) => p.style)
  const runs = $derived.by(() => {
    const out: { art: boolean; rows: Line[] }[] = []
    for (const l of lines) {
      const art = isArt(l)
      const last = out[out.length - 1]
      if (last && last.art === art) last.rows.push(l)
      else out.push({ art, rows: [l] })
    }
    return out
  })
</script>

<figure class="m-0 overflow-hidden rounded-lg border border-line" style="background: var(--term-bg); color: var(--term-fg)">
  <figcaption class="flex items-center gap-2 border-b px-4 py-2 font-mono text-[11px]" style="border-color: #ffffff14; color: var(--term-dim)">
    <span aria-hidden="true" class="inline-block size-2 rounded-full" style="background: var(--term-dim); opacity: 0.5"></span>
    {title}
  </figcaption>
  <div class="overflow-x-auto px-4 py-3 font-mono text-[12.5px]">
    <pre class="m-0 leading-[1.65]"><code><span class="t-prompt select-none">$ </span>{cmd.slice(0, typed)}{#if cursor}<span class="t-cursor"></span>{/if}</code></pre>
    {#if showOutput}
      {#each runs as run}
        <pre class="m-0 {run.art ? 'my-1 leading-none' : 'leading-[1.65]'}"><code>{#each run.rows as line, li}{#if li > 0}{'\n'}{/if}{#if line.length === 0}{' '}{:else}{#each line as p}<span class={p.tone === 'plain' ? '' : 't-' + p.tone} style={p.style}>{p.text}</span>{/each}{/if}{/each}</code></pre>
      {/each}
    {/if}
  </div>
</figure>
