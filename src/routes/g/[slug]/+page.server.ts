import { client } from '$lib/sanity'
import { galleryQ } from '$lib/queries'

export const load = async ({ params }) => {
  const gallery = await client.fetch(galleryQ, { slug: params.slug })
  if (!gallery) return { status: 404 }
  return { gallery }
}
