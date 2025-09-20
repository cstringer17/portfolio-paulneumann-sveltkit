// $lib/data/getGalleries.ts
import { client } from '$lib/sanity'
import { galleriesQ } from '$lib/queries'

export type GalleryPageOpts = { offset?: number; limit?: number }

export async function getGalleries({ offset = 0, limit = 24 }: GalleryPageOpts) {
  const end = offset + limit
  const galleries = await client.fetch(galleriesQ, { offset, end })
  return { galleries, pagination: { offset, limit, end } }
}
