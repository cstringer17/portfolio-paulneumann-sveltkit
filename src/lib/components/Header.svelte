<script lang="ts">
  import { afterNavigate } from '$app/navigation';
  let open = false;

  const links = [
    { href: '/galleries', label: 'Portfolio' },
    { href: '/stories',   label: 'Stories' },
    { href: '/trips',     label: 'Trips' },
    { href: '/contact',   label: 'Contact' }
  ];

  afterNavigate(() => (open = false)); // close on navigation
</script>

<nav class="fixed top-0 inset-x-0 z-50 bg-transparent relative">
  <!-- hairline -->
  <span
    class="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2
           h-px w-[92%] md:w-[88%] max-w-6xl
           bg-gradient-to-r from-transparent via-slate-300 to-transparent">
  </span>

  <div class="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
    <!-- Brand -->
    <a href="/" class="text-slate-800 font-montserrat text-2xl font-light tracking-wide hover:text-slate-900 transition-colors">
      Paul Neumann
    </a>

    <!-- Desktop -->
    <ul class="hidden md:flex gap-9 text-base md:text-[14px] font-montserrat">
      {#each links as item}
        <li>
          <a
            href={item.href}
            class="relative inline-block py-1 text-slate-600 hover:text-slate-900 transition-colors
                   after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-cyan-500 after:transition-all
                   hover:after:w-full focus-visible:after:w-full focus:outline-none"
          >
            {item.label}
          </a>
        </li>
      {/each}
    </ul>

    <!-- Mobile toggle -->
    <button
      class="md:hidden text-slate-600 hover:text-slate-900 transition-colors"
      aria-label="Menu"
      aria-controls="mobile-nav"
      aria-expanded={open}
      on:click={() => (open = !open)}
    >
      <!-- simple morph: three lines / X -->
      {#if !open}
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
             viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
             viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      {/if}
    </button>
  </div>

  <!-- Mobile panel -->
  <div
    id="mobile-nav"
    class="md:hidden overflow-hidden transition-[max-height,opacity] duration-300"
    style:max-height={open ? '320px' : '0px'}
    style:opacity={open ? 1 : 0}
  >
    <div class="mx-auto max-w-7xl px-6 pb-4">
      <ul class="flex flex-col gap-2 rounded-xl bg-white/90 backdrop-blur shadow border border-slate-200 p-3">
        {#each links as item}
          <li>
            <a
              href={item.href}
              class="block rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
              on:click={() => (open = false)}
            >
              {item.label}
            </a>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</nav>

<!-- Close on Escape -->
<svelte:window
  on:keydown={(e) => e.key === 'Escape' && (open = false)}
  on:resize={() => { if (matchMedia('(min-width: 768px)').matches) open = false; }}
/>
