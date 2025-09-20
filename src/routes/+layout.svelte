<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import '../app.css'
  import favicon from '$lib/assets/favicon.svg'
  import Header from '$lib/components/Header.svelte'
  import Footer from '$lib/components/Footer.svelte'
  import { page } from '$app/stores'

  $: showHeader = $page.data?.layout?.header ?? true
  $: showFooter = $page.data?.layout?.footer ?? true
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen flex flex-col">
  {#if showHeader}<Header />{/if}

  <!-- flex-1 grows to push footer down; pt-16 only when header is shown (fixed h-16) -->
  <main class="flex-1" >
    <slot />
  </main>

  {#if showFooter}<Footer />{/if}
</div>
