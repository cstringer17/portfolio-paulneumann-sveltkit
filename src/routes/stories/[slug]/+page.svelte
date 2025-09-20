<script lang="ts">
  export let data: { story: any }
  import { urlFor } from '$lib/sanity'
  import { PortableText } from '@portabletext/svelte'

  const fmt = (d?: string) =>
    d ? new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : ''
</script>

<div class="mx-auto max-w-3xl px-4 py-16">
  {#if !data.story}
    <p class="text-slate-500">Story not found.</p>
  {:else}
    <article>
      <!-- Cover image (editorial: clean edge, light border, no overlay) -->
      {#if data.story.cover}
        <figure class="mb-8 border border-slate-200 bg-white">
          <div class="relative aspect-[16/9] overflow-hidden bg-slate-100">
            <img
              src={urlFor(data.story.cover).width(1600).height(900).fit('crop').auto('format').url()}
              alt={data.story.cover?.alt || data.story.title}
              class="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </figure>
      {/if}

      <!-- Title + meta -->
      <header>
        <p class="text-xs uppercase tracking-widest text-slate-600 font-montserrat">
          {fmt(data.story.date)}
        </p>
        <h1 class="mt-1 text-3xl md:text-5xl text-slate-900 font-montserrat font-bold">
          {data.story.title}
        </h1>
        {#if data.story.excerpt}
          <p class="mt-3 text-lg text-slate-700">
            {data.story.excerpt}
          </p>
        {/if}
      </header>

      <!-- Body (typography tuned for white; cyan used only as link accent) -->
      <div
        class="prose prose-slate mt-8 max-w-none
               prose-headings:font-montserrat prose-h2:text-slate-900 prose-h3:text-slate-900
               prose-img:rounded-none prose-figcaption:text-slate-500
               prose-a:text-cyan-700 hover:prose-a:text-cyan-800"
      >
        <PortableText value={data.story.body} />
      </div>
    </article>
  {/if}
</div>
