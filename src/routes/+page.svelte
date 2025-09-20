<script lang="ts">
  export let data: { galleries: any[] }
  import { urlFor } from '$lib/sanity'
  import GalleriesGrid from '$lib/components/GalleriesGrid.svelte'
  const hero = {
    title: "Shark & Ocean Wildlife Photography",
    kicker: "Paul Neumann",
    blurb:
      "Close encounters in the Indian Ocean — tiger sharks, pelagics, and the stories behind every frame.",
    ctas: [
      { href: "/galleries", label: "Portfolio" },
      { href: "/stories", label: "Stories from the Sea" },
      { href: "/trips", label: "Trips" },
      { href: "/contact", label: "Contact & Socials" }
    ]
  }

  const heroPhoto = data.galleries?.[0]?.heroPhoto ?? null

  const imageUrl = (photo: any, variant: 'desktop' | 'mobile' = 'desktop') => {
    if (!photo?.image) return null
    const isMobile = variant === 'mobile'
    const w = isMobile ? 1080 : 2560
    const h = isMobile ? 1440 : 1440
    return urlFor(photo.image)
      .width(w)
      .height(h)
      .fit('crop')
      .auto('format')
      .dpr(2)
      .url()
  }

  const objectPosition = (photo: any) => {
    const hs = photo?.hotspot
    if (!hs) return '50% 50%'
    return `${(hs.x * 100).toFixed(2)}% ${(hs.y * 100).toFixed(2)}%`
  }

  const pickHeroPhoto = (g: any) => g?.heroPhoto ?? g?.cover ?? g?.photos?.[0] ?? null
</script>

<div class="relative isolate">
  <!-- HERO -->
  <header class="relative h-[100svh] min-h-[640px] flex items-end justify-center overflow-hidden">
    <!-- Background image -->
    <picture>
      <source media="(max-width: 640px)" srcset={imageUrl(heroPhoto, 'mobile') || ''} />
      <img
        src={imageUrl(heroPhoto, 'desktop') || ''}
        alt={heroPhoto?.alt || heroPhoto?.title || 'hero'}
        class="absolute inset-0 w-full h-full object-cover bg-slate-950 [will-change:transform] animate-[breathe_10s_ease-in-out_infinite]"
        style={`object-position: ${objectPosition(heroPhoto)};`}
        loading="eager"
        fetchpriority="high"
        decoding="async"
      />
    </picture>

    <!-- subtle top vignette -->
    <div class="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/30 via-transparent to-slate-950/10"></div>

    <!-- Text block with background gradient for legibility -->
    <div class="relative text-center px-6 max-w-3xl pb-24 sm:pb-28">
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent -z-10 rounded-xl"></div>

      <p class="text-xs sm:text-sm uppercase tracking-widest text-slate-200 font-montserrat drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
        {hero.kicker}
      </p>

      <h1 class="mt-3 text-4xl md:text-6xl font-thin text-white font-montserrat drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
        {hero.title}
      </h1>

      <p class="mt-4 text-white font-light font-montserrat drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
        {hero.blurb}
      </p>

      <!-- CTA cluster -->
      <nav aria-label="Hero quick links" class="mt-7 sm:mt-8">
  <ul class="flex flex-wrap justify-center gap-3 sm:gap-4">
    {#each hero.ctas as c}
      <li>
        <a
          href={c.href}
          class="px-4 sm:px-5 py-2
                 text-cyan-100 border border-cyan-800/60 backdrop-blur-[2px]
                 hover:border-cyan-400 hover:text-cyan-300
                 transition font-montserrat uppercase tracking-wide
                 text-[11px] sm:text-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
          target={c.href.startsWith('http') ? '_blank' : undefined}
          rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {c.label}
        </a>
      </li>
    {/each}
  </ul>
</nav>

    </div>

    <!-- Scroll chevron anchor -->
    <a
      href="#galleries"
      aria-label="Scroll to galleries"
      class="absolute bottom-4 left-1/2 -translate-x-1/2 inline-flex flex-col items-center text-slate-300 hover:text-cyan-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
    >
      <span class="text-[10px] tracking-widest uppercase font-montserrat">Scroll</span>
      <svg class="w-6 h-6 mt-1 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" />
      </svg>
    </a>
  </header>


  <GalleriesGrid galleries={data.galleries} />

</div>
