<script lang="ts">
  export let data: { galleries: any[] }
  import GalleriesGrid from '$lib/components/GalleriesGrid.svelte'
</script>

<GalleriesGrid
  galleries={data.galleries}
  title="All Galleries"
  showHeader={true}
/>
