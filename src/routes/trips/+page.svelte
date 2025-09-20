<script lang="ts">
  import { tick } from 'svelte'

  export let data: {
    trips: {
      _id: string
      title: string
      slug: { current: string }
      location?: string
      whenText?: string
      minCert?: string
      priceFrom?: number
      imageUrl: string
      imagePos: string
    }[]
    certOptions: readonly { title: string; value: string }[]
    form?: { success?: boolean; tripId?: string; error?: string }
  }

  // modal state
  let active: (typeof data.trips)[number] | null = null
  let nameEl: HTMLInputElement | null = null
  const open = async (t: (typeof data.trips)[number]) => {
    active = t
    await tick()
    nameEl?.focus()
  }
  const close = () => (active = null)
  const onKeydown = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }

  const fmtPrice = (n?: number) =>
    n == null ? '' : new Intl.NumberFormat('en-AU', {
      style: 'currency', currency: 'AUD', maximumFractionDigits: 0
    }).format(n)
</script>

<svelte:window on:keydown={onKeydown} />

<section class="mx-auto max-w-7xl px-4 py-16">
  <header class="mb-10 flex items-end justify-between">
    <div>
      <h1 class="text-2xl md:text-3xl text-slate-900 font-montserrat">Trips (Coming Soon)</h1>
      <p class="text-slate-600 font-montserrat">Register your interest and we’ll ping you when dates open.</p>
    </div>
    <span class="text-cyan-700 text-sm font-montserrat">{data.trips?.length || 0} trips</span>
  </header>

  {#if data.form?.error}
    <p class="text-red-600 mb-6">{data.form.error}</p>
  {/if}

  {#if !data.trips?.length}
    <p class="text-slate-600">No upcoming trips yet.</p>
  {:else}
    <ul class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {#each data.trips as t}
        <!-- Editorial card: white background, light border, no overlay/zoom -->
        <li class="border border-slate-200 bg-white">
          <div class="relative aspect-[16/10] overflow-hidden bg-slate-100">
            {#if t.imageUrl}
              <img
                src={t.imageUrl}
                alt={t.title}
                class="absolute inset-0 h-full w-full object-cover"
                style:object-position={t.imagePos}
                loading="lazy"
                decoding="async"
              />
            {/if}
          </div>

          <div class="p-4">
            <h2 class="text-slate-900 font-montserrat">{t.title}</h2>
            <p class="text-slate-600 text-sm mt-1">
              {[t.location, t.whenText].filter(Boolean).join(' • ')}
            </p>
            {#if t.priceFrom}
              <p class="text-slate-800 mt-2">{fmtPrice(t.priceFrom)}+</p>
            {/if}

            {#if data.form?.success && data.form?.tripId === t._id}
              <p class="text-green-600 mt-3">Thanks! We’ll email you when dates open.</p>
            {:else}
              <div class="mt-4">
                <button
                  type="button"
                  class="px-5 py-2 text-slate-900 border border-slate-300 bg-white
                         hover:border-cyan-500 hover:text-cyan-700 transition
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40"
                  on:click={() => open(t)}
                  aria-label={`Register interest for ${t.title}`}
                >
                  Register interest
                </button>
              </div>
            {/if}
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</section>

{#if active}
  <div class="fixed inset-0 z-50">
    <!-- backdrop -->
    <div class="absolute inset-0 bg-black/50" on:click={close}></div>

    <!-- dialog -->
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="trip-modal-title"
      class="relative mx-auto max-w-xl mt-16 bg-white border border-slate-200"
    >
      <header class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <h3 id="trip-modal-title" class="text-slate-900 text-lg font-montserrat">
          Register interest — {active.title}
        </h3>
        <button
          class="text-slate-600 hover:text-cyan-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/30"
          on:click={close}
          aria-label="Close"
        >✕</button>
      </header>

      <form method="POST" action="?/lead" class="p-6 grid gap-4">
        <input type="hidden" name="tripId" value={active._id} />
        <!-- honeypot -->
        <input type="text" name="website" tabindex="-1" autocomplete="off"
               class="absolute -left-[9999px] w-px h-px overflow-hidden" />

        <label class="grid gap-1">
          <span class="text-slate-700 text-sm">Name*</span>
          <input name="name" required
                 class="bg-white border border-slate-300 px-3 py-2 text-slate-900
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/30"
                 bind:this={nameEl} />
        </label>

        <label class="grid gap-1">
          <span class="text-slate-700 text-sm">Email*</span>
          <input name="email" type="email" required
                 class="bg-white border border-slate-300 px-3 py-2 text-slate-900
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/30" />
        </label>

        <label class="grid gap-1">
          <span class="text-slate-700 text-sm">Phone</span>
          <input name="phone"
                 class="bg-white border border-slate-300 px-3 py-2 text-slate-900
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/30" />
        </label>

        <label class="grid gap-1">
          <span class="text-slate-700 text-sm">Certification</span>
          <select name="certLevel"
                  class="bg-white border border-slate-300 px-3 py-2 text-slate-900
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/30">
            <option value="">Select…</option>
            {#each data.certOptions as o}
              <option value={o.value}>{o.title}</option>
            {/each}
          </select>
        </label>

        <label class="grid gap-1">
          <span class="text-slate-700 text-sm">Dives logged</span>
          <input name="divesLogged" type="number" min="0" inputmode="numeric"
                 class="bg-white border border-slate-300 px-3 py-2 text-slate-900
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/30" />
        </label>

        <label class="grid gap-1">
          <span class="text-slate-700 text-sm">Message</span>
          <textarea name="message" rows="3"
                    class="bg-white border border-slate-300 px-3 py-2 text-slate-900
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/30"></textarea>
        </label>

        <label class="flex items-center gap-2 mt-1">
          <input type="checkbox" name="consent" required class="accent-cyan-600" />
          <span class="text-slate-700 text-sm">I agree to be contacted about this trip*</span>
        </label>

        <div class="mt-2 flex gap-3">
          <button
            type="submit"
            class="px-6 py-3 text-slate-900 border border-slate-300 bg-white
                   hover:border-cyan-500 hover:text-cyan-700 transition
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40"
          >
            Submit
          </button>
          <button
            type="button"
            on:click={close}
            class="px-6 py-3 border border-slate-300 text-slate-700
                   hover:text-cyan-700 hover:border-cyan-500 transition
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
