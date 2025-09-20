<script lang="ts">
  import { urlFor } from '$lib/sanity'

  export let galleries: any[] = []
  export let title = 'Galleries'
  export let subtitle = 'Selected sets from recent dives.'
  export let showHeader = true
  export let linkPrefix = '/g' // e.g. /g/<slug>

  const pickHeroPhoto = (g: any) => g?.heroPhoto ?? g?.cover ?? g?.photos?.[0] ?? null

  const imageUrl = (photo: any) => {
    if (!photo?.image) return ''
    return urlFor(photo.image)
      .width(1440)
      .height(640)
      .fit('crop')
      .auto('format')
      .dpr(2)
      .url()
  }

  const getSlug = (g: any) => (typeof g?.slug === 'string' ? g.slug : g?.slug?.current || '')
  const getAlt = (g: any, p: any) => p?.alt || p?.title || g?.title || 'gallery'
</script>

<div class="mx-auto max-w-7xl px-4 py-16">
  {#if showHeader}
    <div class="flex items-end justify-between mb-10">
      <div>
        <h2 class="text-2xl font-semibold text-white font-montserrat">{title}</h2>
        {#if subtitle}<p class="text-slate-400 text-sm font-montserrat">{subtitle}</p>{/if}
      </div>
      <span class="text-slate-500 text-sm font-montserrat">{galleries?.length || 0} collections</span>
    </div>
  {/if}

  {#if !galleries?.length}
    <p class="text-slate-400 font-montserrat">No galleries yet.</p>
  {:else}
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {#each galleries as g (getSlug(g))}
        {#if pickHeroPhoto(g)}
          {#key getSlug(g)}
            <a
              href={`${linkPrefix}/${getSlug(g)}`}
              class="group relative overflow-hidden bg-slate-900 border border-slate-800 hover:border-cyan-400 transition">
              <img
                src={imageUrl(pickHeroPhoto(g))}
                alt={getAlt(g, pickHeroPhoto(g))}
                class="h-64 w-full object-cover transition duration-700 group-hover:scale-105" />

              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 flex items-end">
                <div class="p-4">
                  <h3 class="text-white font-medium font-montserrat">{g.title}</h3>
                  {#if pickHeroPhoto(g)?.title}
                    <p class="text-slate-400 text-xs font-montserrat">{pickHeroPhoto(g)?.title}</p>
                  {/if}
                </div>
              </div>
            </a>
          {/key}
        {/if}
      {/each}
    </div>
  {/if}
</div>
