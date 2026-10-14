<script lang="ts">
  import DocsLayout from '../components/DocsLayout.svelte'
  import Link from '../components/Link.svelte'
  import CodeBlock from '../components/CodeBlock.svelte'
  import { commands, navGroups } from '../lib/data'
</script>

<DocsLayout>
  <h1 class="font-mono text-3xl font-bold tracking-tight">Documentation</h1>
  <p class="mt-3 max-w-xl text-muted">
    Every command with its flags and the output the CLI really prints. Outputs were captured from the v2 binary and paths are shortened to <code class="font-mono text-[0.85em] text-fg">C:\Users\you</code>.
  </p>

  <div class="mt-8 grid gap-3">
    <CodeBlock code="cwm --help" prompt="$" />
  </div>

  {#each navGroups as g}
    <section class="mt-12">
      <h2 class="font-mono text-sm text-muted">{g.title}</h2>
      <ul class="mt-4 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
        {#each g.commands.filter((id) => commands[id]) as id}
          <li class="bg-bg">
            <Link to={`/docs/${id}`} class="group flex h-full flex-col gap-1.5 p-5 transition-colors hover:bg-panel">
              <span class="font-mono text-[15px] font-bold group-hover:text-accent">cwm {id}</span>
              <span class="text-sm leading-relaxed text-muted">{commands[id].summary}</span>
            </Link>
          </li>
        {/each}
      </ul>
    </section>
  {/each}
</DocsLayout>
