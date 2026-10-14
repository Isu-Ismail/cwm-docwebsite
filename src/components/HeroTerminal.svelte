<script lang="ts">
  import { onMount } from 'svelte'
  import { scenarios } from '../lib/data'
  import { styleOutput } from '../lib/terminal'

  // One command at a time: type it, show its real output, hold, clear, next command.
  // First paint (and crawlers, and no-JS) get the first scenario fully rendered.
  let idx = $state(0)
  let typed = $state(scenarios[0].cmd.length)
  let showOutput = $state(true)
  let run = 0

  const current = $derived(scenarios[idx])
  const lines = $derived(styleOutput(current.output))

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

  async function play(token: number) {
    await sleep(2800)
    let i = idx
    while (token === run) {
      i = (i + 1) % scenarios.length
      idx = i
      showOutput = false
      typed = 0
      const cmd = scenarios[i].cmd
      for (let n = 1; n <= cmd.length; n++) {
        if (token !== run) return
        typed = n
        await sleep(32 + Math.random() * 38)
      }
      await sleep(380)
      if (token !== run) return
      showOutput = true
      await sleep(2600 + scenarios[i].output.split('\n').length * 170)
    }
  }

  onMount(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const token = ++run
    play(token)
    return () => {
      run++
    }
  })
</script>

<div class="relative h-[26rem] min-w-0 lg:h-auto lg:min-h-[26rem]">
<figure class="m-0 flex h-full flex-col overflow-hidden rounded-xl border border-line lg:absolute lg:inset-0" style="background: var(--term-bg); color: var(--term-fg)" aria-label="Demo terminal session">
  <figcaption class="flex shrink-0 items-center gap-2 border-b px-4 py-2.5 font-mono text-[11px]" style="border-color: #ffffff14; color: var(--term-dim)">
    <span aria-hidden="true" class="inline-block size-2 rounded-full" style="background: var(--term-dim); opacity: 0.5"></span>
    ~/projects
  </figcaption>
  <div class="flex-1 overflow-hidden px-5 py-4 font-mono text-[13px] leading-[1.7]">
    <pre class="m-0 whitespace-pre-wrap break-words font-[inherit]"><span class="t-prompt select-none">$ </span>{current.cmd.slice(0, typed)}{#if !showOutput}<span class="t-cursor"></span>{/if}</pre>
    {#if showOutput}
      <pre class="m-0 mt-1 overflow-hidden font-[inherit]">{#each lines as line, li}{#if li > 0}{'\n'}{/if}{#if line.length === 0}{' '}{:else}{#each line as p}<span class={p.tone === 'plain' ? '' : 't-' + p.tone}>{p.text}</span>{/each}{/if}{/each}</pre>
      <pre class="m-0 mt-3 font-[inherit]"><span class="t-prompt select-none">$ </span><span class="t-cursor"></span></pre>
    {/if}
  </div>
</figure>
</div>
