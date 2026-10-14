<script lang="ts">
  import { onMount } from 'svelte'
  import CodeBlock from '../components/CodeBlock.svelte'
  import Terminal from '../components/Terminal.svelte'
  import Link from '../components/Link.svelte'
  import { commands, downloadInfo, type DownloadFile } from '../lib/data'

  const osList = [
    { id: 'windows', label: 'Windows' },
    { id: 'linux', label: 'Linux' },
    { id: 'macos', label: 'macOS' },
  ]
  const archLabel: Record<string, string> = { amd64: 'x64 / Intel', arm64: 'ARM64' }

  let os = $state('windows')
  let arch = $state('amd64')
  let format = $state('deb')

  // Guess the visitor's system after mount. Server render stays on Windows / x64.
  onMount(() => {
    const ua = navigator.userAgent.toLowerCase()
    if (ua.includes('mac')) {
      os = 'macos'
      arch = 'arm64'
    } else if (ua.includes('linux') && !ua.includes('android')) {
      os = 'linux'
      if (ua.includes('aarch64') || ua.includes('arm64')) arch = 'arm64'
    }
  })

  const archs = $derived(Object.keys(downloadInfo.packages[os]))
  const formats = $derived.by(() => {
    const e = downloadInfo.packages[os][arch]
    return e && !('file' in e) ? Object.keys(e) : []
  })
  const entry = $derived.by((): DownloadFile | null => {
    const byArch = downloadInfo.packages[os][arch] ?? downloadInfo.packages[os][archs[0]]
    if (!byArch) return null
    if ('file' in byArch) return byArch as DownloadFile
    const byFormat = byArch as Record<string, DownloadFile>
    return byFormat[format] ?? byFormat[Object.keys(byFormat)[0]]
  })
  const url = $derived(entry ? `${downloadInfo.repoBase}/download/${downloadInfo.latest}/${entry.file}` : '')
  const installCmd = $derived(entry ? entry.install_cmd.replaceAll('{url}', url) : '')

  function pickOs(id: string) {
    os = id
    if (!downloadInfo.packages[id][arch]) arch = Object.keys(downloadInfo.packages[id])[0]
  }

  const tab = (on: boolean) =>
    `cursor-pointer rounded border px-3 py-1.5 font-mono text-xs transition-colors ${on ? 'border-accent text-accent' : 'border-line text-muted hover:border-muted hover:text-fg'}`
</script>

<section class="mx-auto max-w-5xl px-4 py-12 sm:px-8 lg:px-12">
  <p class="font-mono text-xs text-muted">Version {downloadInfo.latest}</p>
  <h1 class="mt-2 font-mono text-3xl font-bold tracking-tight">Install cwm</h1>
  <p class="mt-3 max-w-xl text-muted">One binary, no runtime. Pick your system, run the command, then check it with <code class="font-mono text-[0.85em] text-fg">cwm hello</code>.</p>

  <div class="mt-8 flex flex-wrap gap-6">
    <div class="flex gap-1.5" role="tablist" aria-label="Operating system">
      {#each osList as o}
        <button type="button" role="tab" aria-selected={os === o.id} class={tab(os === o.id)} onclick={() => pickOs(o.id)}>{o.label}</button>
      {/each}
    </div>
    {#if archs.length > 1}
      <div class="flex gap-1.5" role="tablist" aria-label="Architecture">
        {#each archs as a}
          <button type="button" role="tab" aria-selected={arch === a} class={tab(arch === a)} onclick={() => (arch = a)}>{archLabel[a] ?? a}</button>
        {/each}
      </div>
    {/if}
    {#if formats.length > 1}
      <div class="flex gap-1.5" role="tablist" aria-label="Package format">
        {#each formats as f}
          <button type="button" role="tab" aria-selected={format === f} class={tab(format === f)} onclick={() => (format = f)}>.{f}</button>
        {/each}
      </div>
    {/if}
  </div>

  {#if entry}
    <ol class="mt-8 flex flex-col gap-8">
      <li>
        <h2 class="mb-3 font-mono text-sm"><span class="mr-2 text-accent">1</span>Download and install</h2>
        <CodeBlock code={installCmd} prompt={os === 'windows' ? 'PS>' : '$'} />
        <p class="mt-2 text-sm text-muted">
          or <a href={url} rel="noopener" class="font-mono text-accent hover:underline">download {entry.file}</a> yourself.
        </p>
      </li>

      {#if os === 'windows'}
        <li>
          <h2 class="mb-3 font-mono text-sm"><span class="mr-2 text-accent">2</span>Add it to your PATH</h2>
          <CodeBlock code={'[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\\cwm", "User")'} prompt="PS>" />
          <p class="mt-2 text-sm text-muted">Open a new terminal afterwards so the change is picked up.</p>
        </li>
      {/if}

      <li>
        <h2 class="mb-3 font-mono text-sm"><span class="mr-2 text-accent">{os === 'windows' ? 3 : 2}</span>Check that it runs</h2>
        <Terminal cmd="cwm hello" output={commands.hello.examples[0].output} title="cwm hello" />
      </li>

      <li>
        <h2 class="mb-3 font-mono text-sm"><span class="mr-2 text-accent">{os === 'windows' ? 4 : 3}</span>Turn on shell integration</h2>
        <CodeBlock code="cwm setup" prompt="$" />
        <p class="mt-2 text-sm text-muted">
          Adds one block to your shell profile so <code class="font-mono text-[0.85em] text-fg">cwm get name -x</code> runs in your current shell. See <Link to="/docs/setup" class="text-accent hover:underline">cwm setup</Link>.
        </p>
      </li>
    </ol>
  {/if}
</section>
