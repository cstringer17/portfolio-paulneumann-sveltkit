<script lang="ts">
  export let data: { galleries: any[] }
  import { urlFor } from '$lib/sanity'
</script>

<section class="mx-auto max-w-6xl p-4">
  <h1 class="text-2xl font-bold mb-4">Galleries</h1>

  {#if !data.galleries?.length}
    <p>No galleries yet.</p>
  {:else}
    <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
      {#each data.galleries as g}
        <a href={`/g/${g.slug}`} class="block group">
          {#if g.cover?.image}
            <img
              src={urlFor(g.cover.image).width(800).height(600).fit('crop').auto('format').url()}
              alt={g.cover.alt || g.cover.title || g.title}
              loading="lazy"
              class="w-full rounded-xl transition group-hover:opacity-90"
            />
          {/if}
          <h2 class="mt-2 text-lg font-semibold">{g.title}</h2>
        </a>
      {/each}
    </div>
  {/if}
</section>
