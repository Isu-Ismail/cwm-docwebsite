<script lang="ts">
  import Link from './Link.svelte'
  import { siteInfo } from '../lib/data'
</script>

<footer class="mt-24 border-t border-line">
  <div class="mx-auto flex max-w-[100rem] flex-col gap-4 px-4 py-8 font-mono text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
    <p>cwm {siteInfo.version} · {siteInfo.fullName}</p>
    <nav class="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
      <Link to="/docs" class="hover:text-fg">Docs</Link>
      <Link to="/techniques" class="hover:text-fg">Techniques</Link>
      <Link to="/install" class="hover:text-fg">Install</Link>
      <a href={siteInfo.repo} rel="noopener" class="hover:text-fg">GitHub</a>
      <a href={siteInfo.releases} rel="noopener" class="hover:text-fg">Releases</a>
    </nav>
  </div>
</footer>
