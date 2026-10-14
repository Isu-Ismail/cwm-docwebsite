<script lang="ts">
  import type { Snippet } from 'svelte'
  import Link from './Link.svelte'
  import { commands, navGroups } from '../lib/data'

  let { children }: { children: Snippet } = $props()
  let open = $state(false)
</script>

{#snippet menu()}
  <nav aria-label="Commands" class="flex flex-col gap-6 font-mono text-[13px]">
    <Link to="/docs" exact class="text-muted hover:text-fg aria-[current=page]:text-fg">Overview</Link>
    {#each navGroups as g}
      <div>
        <p class="mb-2 text-[11px] uppercase tracking-wider text-muted/70">{g.title}</p>
        <ul class="flex flex-col border-l border-line">
          {#each g.commands.filter((id) => commands[id]) as id}
            <li>
              <Link
                to={`/docs/${id}`}
                class="-ml-px block border-l border-transparent py-1 pl-3 text-muted transition-colors hover:text-fg aria-[current=page]:border-accent aria-[current=page]:text-accent"
              >
                {id}
              </Link>
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </nav>
{/snippet}

<div class="mx-auto grid max-w-[100rem] grid-cols-1 gap-8 px-4 py-10 sm:px-8 lg:px-12 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-14">
  <aside class="lg:sticky lg:top-24 lg:self-start">
    <button
      type="button"
      class="flex w-full cursor-pointer items-center justify-between rounded border border-line px-3 py-2 font-mono text-sm text-muted lg:hidden"
      aria-expanded={open}
      onclick={() => (open = !open)}
    >
      Commands <span aria-hidden="true">{open ? '−' : '+'}</span>
    </button>
    <div class="mt-4 {open ? 'block' : 'hidden'} lg:mt-0 lg:block" onclickcapture={() => (open = false)} role="presentation">
      {@render menu()}
    </div>
  </aside>
  <div class="min-w-0">
    {@render children()}
  </div>
</div>
