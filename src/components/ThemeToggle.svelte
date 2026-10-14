<script lang="ts">
  import { onMount } from 'svelte'

  // Server renders "dark". The real value is read from <html data-theme> after mount.
  let theme = $state<'dark' | 'light'>('dark')

  onMount(() => {
    theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
  })

  function toggle() {
    theme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('cwm-theme', theme)
    } catch {
      // Private mode or blocked storage: the theme still changes for this visit.
    }
  }
</script>

<button
  type="button"
  onclick={toggle}
  class="grid size-8 cursor-pointer place-items-center rounded border border-line text-muted transition-colors hover:border-muted hover:text-fg"
  aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
  title={theme === 'dark' ? 'Light theme' : 'Dark theme'}
>
  {#if theme === 'dark'}
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  {:else}
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  {/if}
</button>
