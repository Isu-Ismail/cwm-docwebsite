<script lang="ts">
  import Copy from './Copy.svelte'
  let { code, prompt = '' }: { code: string; prompt?: string } = $props()
</script>

<div class="flex items-start gap-3 rounded-md border border-line bg-panel px-4 py-3">
  <pre class="no-scrollbar min-w-0 flex-1 overflow-x-auto font-mono text-[13px] leading-6 text-fg"><code>{#if prompt}<span class="select-none text-muted">{prompt} </span>{/if}{code}</code></pre>
  <Copy text={code} />
</div>
