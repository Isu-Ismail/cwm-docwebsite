<script lang="ts">
  let { text, label = 'Copy' }: { text: string; label?: string } = $props()
  let done = $state(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      done = true
      clearTimeout(timer)
      timer = setTimeout(() => (done = false), 1600)
    } catch {
      // Clipboard can be blocked (insecure origin, permissions). Nothing useful to do.
    }
  }
</script>

<button
  type="button"
  onclick={copy}
  class="shrink-0 cursor-pointer rounded border border-line px-2 py-1 font-mono text-xs text-muted transition-colors hover:border-muted hover:text-fg"
  aria-label={done ? 'Copied' : `${label} to clipboard`}
>
  {done ? 'Copied' : label}
</button>
