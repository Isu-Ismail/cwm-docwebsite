<script lang="ts">
  import type { Snippet } from 'svelte'
  import { href, navigate, router } from '../lib/router.svelte'

  let {
    to,
    class: cls = '',
    exact = false,
    children,
  }: { to: string; class?: string; exact?: boolean; children: Snippet } = $props()

  const current = $derived(exact ? router.path === to : router.path === to || router.path.startsWith(to + '/'))

  function onclick(e: MouseEvent) {
    // Let the browser handle new-tab clicks and anything that is not a plain left click.
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(to)
  }
</script>

<a href={href(to)} class={cls} aria-current={current ? 'page' : undefined} {onclick}>{@render children()}</a>
