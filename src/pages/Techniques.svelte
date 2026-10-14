<script lang="ts">
  import Link from '../components/Link.svelte'
  import { techniques } from '../lib/data'
</script>

<section class="mx-auto max-w-5xl px-4 py-12 sm:px-8 lg:px-12">
  <h1 class="font-mono text-3xl font-bold tracking-tight">Techniques</h1>
  <p class="mt-3 max-w-xl text-muted">Ready-made saved commands. Each one has a one-liner that runs <code class="font-mono text-[0.85em] text-fg">cwm save</code> for you, and the full script for each system.</p>

  <ul class="mt-8 grid gap-px overflow-hidden rounded-lg border border-line bg-line">
    {#each techniques as t}
      <li class="bg-bg">
        <Link to={`/techniques/${t.id}`} class="group flex flex-col gap-2 p-5 transition-colors hover:bg-panel">
          <span class="font-mono text-[15px] font-bold group-hover:text-accent">{t.name}</span>
          <span class="text-sm leading-relaxed text-muted">{t.description}</span>
          <span class="flex gap-2 font-mono text-[11px] text-muted">
            {#each t.tags as tag}<span class="rounded border border-line px-1.5 py-0.5">{tag}</span>{/each}
            <span class="ml-auto">{Object.keys(t.systems).join(' · ')}</span>
          </span>
        </Link>
      </li>
    {/each}
  </ul>
</section>
