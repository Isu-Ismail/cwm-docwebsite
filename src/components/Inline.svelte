<script lang="ts">
  import { parseInline } from '../lib/inline'
  let { text }: { text: string } = $props()
  const segs = $derived(parseInline(text))
</script>

{#each segs as s}{#if s.kind === 'code'}<code>{s.text}</code>{:else if s.kind === 'bold'}<strong class="font-semibold text-fg">{s.text}</strong>{:else}{s.text}{/if}{/each}
