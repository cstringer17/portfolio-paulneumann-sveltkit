// src/routes/+page.server.ts
import { client } from '$lib/sanity'
import { storiesQ } from '$lib/queries'

export const load = async () => {
  console.log('[home] server load starting')
  const offset = 0        // start at first gallery
  const limit  = 24       // how many to load per page (change as needed)
  const end    = offset + limit

  const stories = await client.fetch(storiesQ, { offset, end })
  console.log(stories)

  return {
    stories,
    layout: { header: true, footer: true },
    pagination: { offset, limit, end }
  }
}
