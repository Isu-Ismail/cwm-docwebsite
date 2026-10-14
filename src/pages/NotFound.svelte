<script lang="ts">
  import Link from '../components/Link.svelte'
  import Terminal from '../components/Terminal.svelte'
</script>

<section class="mx-auto max-w-2xl px-4 py-24 sm:px-8 lg:px-12">
  <Terminal cmd="cwm get this-page" output="Error: Command 'this-page' not found." title="404" />
  <h1 class="mt-8 font-mono text-2xl font-bold">Page not found</h1>
  <p class="mt-2 text-muted">The page you asked for does not exist or was moved.</p>
  <div class="mt-6 flex gap-4 font-mono text-sm">
    <Link to="/" exact class="text-accent hover:underline">Home</Link>
    <Link to="/docs" class="text-accent hover:underline">Docs</Link>
  </div>
</section>
