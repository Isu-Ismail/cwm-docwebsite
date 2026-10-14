<script lang="ts">
  // The cwm face: a ">" chevron, two eyes and a mouth line. Colours come from CSS tokens.
  let { size = 28 }: { size?: number } = $props()
</script>

<svg width={size} height={size * 1.013} viewBox="0 0 300 304" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path
    d="M292.643 150.501C292.643 213.287 241.745 264.186 178.959 264.186C116.173 264.186 65.2744 213.287 65.2744 150.501C65.2744 87.7153 116.173 36.8172 178.959 36.8172C241.745 36.8172 292.643 87.7154 292.643 150.501Z"
    fill="var(--face)"
  />
  <circle cx="243.959" cy="121.501" r="20" fill="var(--accent)" />
  <path d="M197.459 25.0014L29.3968 152.099C28.861 152.505 28.8692 153.312 29.4132 153.707L197.459 275.501" stroke="var(--accent)" stroke-width="50" stroke-linecap="round" />
  <path d="M192.959 176.501C212.875 176.111 224.042 175.892 243.959 175.501" stroke="var(--accent)" stroke-width="40" stroke-linecap="round" />
  <circle cx="192.959" cy="121.501" r="20" fill="var(--accent)" />
</svg>
