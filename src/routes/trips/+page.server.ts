// src/routes/trips/+page.server.ts
import type { Actions, PageServerLoad } from './$types'
import type { SanityDocumentStub } from '@sanity/client'
import { client, urlFor } from '$lib/sanity' // ensure you export urlFor from $lib/sanity
import { fail } from '@sveltejs/kit'

// --- typed options we also return to the page ---
const certOptions = [
  { title: 'Open Water', value: 'ow' },
  { title: 'Advanced',   value: 'aow' },
  { title: 'Rescue',     value: 'rescue' },
  { title: 'Divemaster', value: 'dm' },
  { title: 'Instructor', value: 'instructor' },
] as const
type CertValue = typeof certOptions[number]['value']

// ---- image + hotspot types ----
type SanityHotspot = { x: number; y: number; height: number; width: number }
type SanityCrop = { left: number; right: number; top: number; bottom: number }
type SanityImage = {
  asset?: { _ref: string; _type?: string }
  hotspot?: SanityHotspot
  crop?: SanityCrop
}

// ---- Trip shapes (raw from GROQ, and mapped for the UI) ----
type Trip = {
  _id: string
  title: string
  slug: { current: string }
  location?: string
  whenText?: string
  minCert?: CertValue
  priceFrom?: number
  image?: SanityImage
}
type TripOut = Omit<Trip, 'image'> & {
  imageUrl: string
  imagePos: string
}

const TRIPS_QUERY = `
*[_type=="trip" && status=="prebook"] | order(whenText asc){
  _id, title, slug, location, whenText, minCert, priceFrom,
  "image": heroImage{asset, hotspot, crop}
}
`

const objPos = (img?: SanityImage) =>
  img?.hotspot ? `${(img.hotspot.x * 100).toFixed(2)}% ${(img.hotspot.y * 100).toFixed(2)}%` : '50% 50%'

export const load: PageServerLoad = async () => {
  const raw = await client.fetch<Trip[]>(TRIPS_QUERY)
  const trips: TripOut[] = raw.map(t => ({
    ...t,
    imageUrl: t.image?.asset ? urlFor(t.image).width(1200).height(750).fit('crop').url() : '',
    imagePos: objPos(t.image),
  }))
  return { trips, certOptions }
}

// ---- tiny per-IP rate limit (60s) ----
const lastHit = new Map<string, number>()
const WINDOW_MS = 60_000

type Ref = { _type: 'reference'; _ref: string }
type TripLeadFields = {
  trip?: Ref
  name: string
  email: string
  phone?: string
  certLevel?: CertValue
  divesLogged?: number
  message?: string
  consent: true
  submittedAt: string
}

export const actions: Actions = {
  lead: async (event) => {
    try {
      const ip = event.getClientAddress()
      const now = Date.now()
      if (now - (lastHit.get(ip) ?? 0) < WINDOW_MS) {
        return fail(429, { error: 'Too many submissions. Try again shortly.' })
      }

      const data = await event.request.formData()

      // honeypot
      if ((data.get('website') as string | null)?.trim()) {
        return { success: true, ignored: true }
      }

      const tripId   = (data.get('tripId') as string | null)?.trim() || null
      const name     = (data.get('name') as string | null)?.trim() || ''
      const email    = (data.get('email') as string | null)?.trim() || ''
      const phone    = (data.get('phone') as string | null)?.trim() || ''
      const cert     = (data.get('certLevel') as CertValue | null) || null
      const divesStr = (data.get('divesLogged') as string | null)?.trim() || ''
      const dives    = divesStr ? Number(divesStr) : undefined
      const message  = (data.get('message') as string | null)?.trim() || ''
      const consent  = (data.get('consent') as string | null) === 'on'

      // validation
      if (!name) return fail(400, { error: 'Name required.' })
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) return fail(400, { error: 'Valid email required.' })
      if (!consent) return fail(400, { error: 'Consent is required.' })
      if (dives !== undefined && (Number.isNaN(dives) || dives < 0)) {
        return fail(400, { error: 'Dives must be a positive number.' })
      }

      // build a properly typed Sanity doc
      const doc: SanityDocumentStub<TripLeadFields> = {
        _type: 'tripLead',
        name,
        email,
        consent: true,
        submittedAt: new Date().toISOString(),
      }
      if (phone) doc.phone = phone
      if (cert) doc.certLevel = cert
      if (dives !== undefined) doc.divesLogged = dives
      if (message) doc.message = message
      if (tripId) doc.trip = { _type: 'reference', _ref: tripId }

      await client.create(doc)

      lastHit.set(ip, now)
      return { success: true, tripId }
    } catch (err) {
      console.error('lead action failed', err)
      return fail(500, { error: 'Something went wrong. Please try again.' })
    }
  }
}
