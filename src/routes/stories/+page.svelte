<script lang="ts">
  export let data: { stories: any[] }
  import { urlFor } from '$lib/sanity'

  const stories = data.stories ?? []
  const [featured, ...rest] = stories

  const fmt = (d?: string) =>
    d ? new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : ''

  const hrefFor = (s: any) =>
    `/stories/${typeof s?.slug === 'string' ? s.slug : (s?.slug?.current ?? '')}`
</script>

<div class="mx-auto max-w-7xl px-4 py-16">
  <!-- Header -->
  <header class="mb-10 flex items-end justify-between">
    <div>
      <p class="text-sm uppercase tracking-widest text-slate-600 font-montserrat">Field Notes</p>
      <h1 class="mt-1 text-4xl md:text-6xl font-bold text-slate-900 font-montserrat">Stories from the Sea</h1>
      <p class="mt-2 text-slate-600 font-montserrat">Behind-the-shot writeups, expeditions & encounters.</p>
    </div>
    <span class="text-cyan-700 text-sm font-montserrat">{stories.length || 0} stories</span>
  </header>

  {#if !stories.length}
    <p class="text-slate-500 font-montserrat">No stories yet.</p>
  {:else}
    <!-- Featured story (editorial: big image, crisp type, no dark overlay) -->
    {#if featured}
      <a
        href={hrefFor(featured)}
        class="group block border border-slate-200 hover:border-cyan-400 transition bg-white"
        aria-label={`Read story: ${featured.title}`}
      >
        {#if featured.cover}
          <div class="relative aspect-[16/9] overflow-hidden bg-slate-100">
            <img
              src={urlFor(featured.cover).width(1600).height(900).fit('crop').auto('format').url()}
              alt={featured.cover?.alt || featured.title}
              class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
              loading="lazy"
              decoding="async"
            />
          </div>
        {/if}

        <!-- bottom content -->
        <div class="p-6 sm:p-8">
          <p class="text-slate-500 text-xs uppercase tracking-widest font-montserrat">{fmt(featured.date)}</p>
          <h2 class="mt-1 text-2xl sm:text-4xl text-slate-900 font-montserrat">{featured.title}</h2>
          {#if featured.excerpt}
            <p class="mt-2 text-slate-700">{featured.excerpt}</p>
          {/if}
          {#if featured.tags?.length}
            <ul class="mt-3 flex flex-wrap gap-2">
              {#each featured.tags as t (t._id)}
                <li class="text-[11px] uppercase tracking-wide text-slate-500">#{t.title}</li>
              {/each}
            </ul>
          {/if}
        </div>
      </a>
    {/if}

    <!-- Grid of the rest (simple cards, light borders, subtle image zoom) -->
    <section aria-label="More stories" class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {#each rest as s (s.slug?.current ?? s.slug)}
        <a
          href={hrefFor(s)}
          class="group block border border-slate-200 hover:border-cyan-400 transition bg-white"
          aria-label={`Read story: ${s.title}`}
        >
          {#if s.cover}
            <div class="relative aspect-[4/3] overflow-hidden bg-slate-100">
              <img
                src={urlFor(s.cover).width(800).height(600).fit('crop').auto('format').url()}
                alt={s.cover?.alt || s.title}
                class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                loading="lazy"
                decoding="async"
              />
            </div>
          {/if}

          <div class="p-4">
            <p class="text-slate-500 text-[11px] uppercase tracking-widest font-montserrat">{fmt(s.date)}</p>
            <h3 class="mt-1 text-slate-900 font-semibold font-montserrat">{s.title}</h3>
            {#if s.excerpt}
              <p class="text-slate-700 text-sm mt-1 line-clamp-2">{s.excerpt}</p>
            {/if}
          </div>
        </a>
      {/each}
    </section>
  {/if}
</div>
