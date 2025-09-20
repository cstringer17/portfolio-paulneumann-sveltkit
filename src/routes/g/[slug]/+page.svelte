<script lang="ts">
  import { urlFor } from '$lib/sanity'
  import { onMount } from 'svelte'

  export let data: { gallery: any }

  const g = data.gallery

  // ---------- helpers ----------
  const sizesFallback = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
  const srcset = (img: any) =>
    [640, 960, 1280, 1600]
      .map((w) => `${urlFor(img).width(w).auto('format').url()} ${w}w`)
      .join(', ')

  const byOrder = (a: any, b: any) => (a?.order ?? 0) - (b?.order ?? 0)
  const hasHeroTag = (p: any) =>
    p?.tags?.some((t: any) => t?.slug?.current === 'hero' || t?.title === 'hero')

  // hero: first "hero"-tagged → gallery.cover → first by order
  const photos: any[] = (g?.photos ?? []).slice().sort(byOrder)
  const heroPhoto =
    photos.find(hasHeroTag) ??
    (g?.cover ? { ...g.cover, image: g.cover?.image ?? g.cover } : null) ??
    photos[0]

  const fmtAperture = (a: any) => (a == null ? null : String(a).startsWith('f/') ? String(a) : `f/${a}`)
  const fmtFocal = (f: any) => (f == null ? null : `${f}mm`)
  const cameraLine = (ex: any) => {
    if (!ex) return null
    const bits = [
      ex.camera,
      ex.lens,
      fmtFocal(ex.focalLength),
      fmtAperture(ex.aperture),
      ex.shutter,
      ex.iso ? `ISO ${ex.iso}` : null
    ].filter(Boolean)
    return bits.join(' • ')
  }

  const depthBadge = (loc: any) => {
    if (!loc || loc.alt == null) return null
    const d = Math.abs(Number(loc.alt))
    return `${d} m depth`
  }

  const pubLabel = g?.published ? null : 'Draft'
  const publishedAt = g?.publishedAt ? new Date(g.publishedAt) : null

  // ---------- JUSTIFIED LAYOUT ----------
  const getAR = (p: any) =>
    p?.image?.asset?.metadata?.dimensions?.aspectRatio ??
    p?.image?.metadata?.dimensions?.aspectRatio ??
    1.5

  let container: HTMLDivElement | null = null
  let rows: Array<Array<{ p: any; w: number; h: number }>> = []

  const ROW_H = 280
  const TOL   = 0.25

  function layout() {
    if (!container) { rows = []; return }
    const W = Math.max(0, container.clientWidth - 1)
    if (!W) { rows = []; return }

    const out: typeof rows = []
    let line: Array<{ p: any; ar: number }> = []
    let arSum = 0

    for (const p of photos) {
      const ar = getAR(p)
      line.push({ p, ar })
      arSum += ar

      const lineW = arSum * ROW_H
      if (lineW > W * (1 - TOL)) {
        const scale = W / lineW
        out.push(line.map((r) => ({ p: r.p, w: r.ar * ROW_H * scale, h: ROW_H * scale })))
        line = []
        arSum = 0
      }
    }

    if (line.length) {
      out.push(line.map((r) => ({ p: r.p, w: r.ar * ROW_H, h: ROW_H })))
    }

    rows = out
  }

  onMount(() => {
    layout()
    if (container) {
      const ro = new ResizeObserver(() => layout())
      ro.observe(container)
      return () => ro.disconnect()
    }
  })

  $: photos, layout()
</script>

<div class="relative isolate">
  <!-- HERO -->
  <header class="relative h-[65vh] min-h-[520px] flex items-end justify-start overflow-hidden">
  {#if heroPhoto?.image}
    <img
      src={urlFor(heroPhoto.image).width(1600).auto('format').url()}
      alt={g?.title || heroPhoto?.alt || heroPhoto?.title || 'gallery hero'}
      class="absolute inset-0 w-full h-full object-cover bg-slate-950 [will-change:transform] brightness-[.82]"
      loading="eager"
      fetchpriority="high"
      decoding="async"
    />
  {/if}

  <!-- subtle top→bottom vignette -->
  <div class="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/30 via-transparent to-slate-950/10"></div>

  <!-- LEFT-ALIGNED TEXT (no background box) -->
  <div class="relative z-10 px-6 pb-12 max-w-5xl w-full text-left">
    <a
      href="/"
      class="inline-block text-slate-300 hover:text-cyan-300 text-sm mb-3 font-montserrat drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]"
    >← Back</a>

    <h1 class="text-4xl md:text-6xl font-thin text-white font-montserrat drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
      {g.title}
    </h1>

    {#if g.description}
      <p class="mt-3 text-white/95 font-light font-montserrat drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]">
        {g.description}
      </p>
    {/if}

    <div class="mt-4 flex flex-wrap items-center gap-3 text-sm font-montserrat">
      <span class="text-cyan-300">{g.photos?.length || 0} photos</span>
      {#if publishedAt}
        <span class="text-slate-400">• Published {publishedAt.toLocaleDateString()}</span>
      {/if}
      {#if pubLabel}
        <span class="px-2 py-0.5 border border-slate-700 text-slate-300 uppercase tracking-wide">
          {pubLabel}
        </span>
      {/if}
    </div>

    {#if heroPhoto?.exif || heroPhoto?.location || heroPhoto?.tags?.length}
      <div class="mt-4 flex flex-wrap items-center gap-2">
        {#if heroPhoto?.exif}
          <span class="px-2 py-1 border border-slate-700 text-slate-200 font-montserrat drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
            {cameraLine(heroPhoto.exif)}
          </span>
        {/if}
        {#if depthBadge(heroPhoto?.location)}
          <span class="px-2 py-1 border border-slate-700 text-cyan-300 font-montserrat">
            {depthBadge(heroPhoto.location)}
          </span>
        {/if}
        {#if heroPhoto?.tags?.length}
          {#each heroPhoto.tags as t}
            <span class="px-2 py-1 border border-slate-700 text-slate-300 font-montserrat">{t.title}</span>
          {/each}
        {/if}
      </div>
    {/if}
  </div>
</header>


  <!-- GRID → JUSTIFIED ROWS -->
  <main class="mx-auto max-w-7xl px-4 py-16">
    {#if !photos.length}
      <p class="text-slate-400 font-montserrat">No photos in this gallery yet.</p>
    {:else}
      <div class="space-y-6" bind:this={container}>
        {#each rows as row}
          <div class="flex gap-6">
            {#each row as item}
              {#key item.p?._id || item.p?.image?._ref || Math.random()}
                <figure
                  class="group relative overflow-hidden bg-slate-900 border border-slate-800 hover:border-cyan-400 transition"
                  style={`width:${item.w}px;height:${item.h}px`}
                >
                  <img
                    src={urlFor(item.p.image).width(Math.min(1600, Math.round(item.w))).auto('format').url()}
                    srcset={srcset(item.p.image)}
                    sizes={`${Math.round(item.w)}px, ${sizesFallback}`}
                    alt={item.p.alt || item.p.title || g.title}
                    width={Math.round(item.w)}
                    height={Math.round(item.h)}
                    class="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />

                  <!-- hover overlay, cyan accent on depth chip -->
                  <figcaption class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 flex items-end">
                    <div class="p-4 w-full">
                      <div class="flex items-start justify-between gap-3">
                        <div class="min-w-0">
                          {#if item.p.title}
                            <p class="text-white text-sm font-medium font-montserrat truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                              {item.p.title}
                            </p>
                          {/if}
                          {#if item.p.alt}
                            <p class="text-slate-300 text-xs font-montserrat line-clamp-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                              {item.p.alt}
                            </p>
                          {/if}
                        </div>
                        {#if depthBadge(item.p.location)}
                          <span class="shrink-0 px-2 py-0.5 border border-slate-700 text-cyan-300 text-[11px] font-montserrat">
                            {depthBadge(item.p.location)}
                          </span>
                        {/if}
                      </div>

                      {#if item.p.tags?.length}
                        <div class="mt-2 flex flex-wrap gap-1">
                          {#each item.p.tags as t}
                            <span class="px-1.5 py-0.5 border border-slate-700 text-slate-300 text-[11px] font-montserrat">{t.title}</span>
                          {/each}
                        </div>
                      {/if}

                      {#if item.p.exif}
                        <p class="mt-2 text-slate-400 text-[11px] font-montserrat">
                          {cameraLine(item.p.exif)}
                        </p>
                      {/if}
                    </div>
                  </figcaption>
                </figure>
              {/key}
            {/each}
          </div>
        {/each}
      </div>
    {/if}
  </main>
</div>
