<!-- src/routes/contact/+page.svelte -->
<script lang="ts">
  import Icon from '@iconify/svelte'
  import { urlFor } from '$lib/sanity'

  // provided by +page.server.ts -> { photo: { alt, caption, image } }
  export let data: { photo?: { alt?: string; caption?: string; image?: any } }

  const links = [
    { label: 'Instagram', sub: '@paulneumann.photo', href: 'https://instagram.com/paulneumann.photo', icon: 'simple-icons:instagram' },
    { label: 'YouTube',   sub: 'Paul Neumann',       href: 'https://youtube.com/@paulneumann',        icon: 'simple-icons:youtube'   },
    { label: 'Threads',   sub: '@paulneumann.photo', href: 'https://www.threads.net/@paulneumann.photo', icon: 'simple-icons:threads' },
    { label: 'Email',     sub: 'hello@paulneumann.com', href: 'mailto:hello@paulneumann.com',        icon: 'tabler:mail' }
  ]
  const ext = (u: string) => u.startsWith('http')
</script>

{#if data.photo?.image}
  <div class="mx-auto mt-10 w-fit px-4">
    <div class="relative">
      <!-- soft glow ring -->
      <div class="absolute -inset-1 rounded-full bg-gradient-to-br from-cyan-400/20 to-transparent blur"></div>

      <img
        src={urlFor(data.photo.image).width(480).height(480).fit('crop').auto('format').url()}
        alt={data.photo.alt ?? 'Profile photo'}
        class="relative mx-auto h-32 w-32 md:h-40 md:w-40 rounded-full object-cover
               border border-slate-800 ring-1 ring-slate-700/60 shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
        loading="eager"
        decoding="async"
      />
    </div>
    {#if data.photo.caption}
      <p class="mt-2 text-center text-xs text-slate-400">{data.photo.caption}</p>
    {/if}
  </div>
{/if}

<section class="mx-auto max-w-3xl px-4 py-12">

  <ul class="grid gap-3">
    {#each links as l}
      <li>
        <a
          href={l.href}
          target={ext(l.href) ? '_blank' : undefined}
          rel={ext(l.href) ? 'noopener noreferrer' : undefined}
          class="group flex items-center justify-between gap-4 px-6 py-4
                 bg-slate-900/80 border border-slate-800 rounded-xl
                 hover:border-cyan-400 hover:text-cyan-300 transition
                 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400/70"
          aria-label={`${l.label}${l.sub ? ' - ' + l.sub : ''}`}
        >
          <span class="flex items-center gap-4">
            <Icon icon={l.icon} width="22" height="22" class="text-slate-300 group-hover:text-cyan-300" />
            <span class="text-slate-200">
              <span class="block font-montserrat">{l.label}</span>
              {#if l.sub}<span class="block text-slate-400 text-sm">{l.sub}</span>{/if}
            </span>
          </span>

          <Icon
            icon="tabler:arrow-up-right"
            width="18"
            height="18"
            class="text-slate-400 group-hover:text-cyan-300 transition-transform group-hover:translate-x-0.5"
          />
        </a>
      </li>
    {/each}
  </ul>
</section>
