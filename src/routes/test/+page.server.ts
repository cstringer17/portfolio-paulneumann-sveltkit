import { client } from '$lib/sanity'
import { galleriesQ } from '$lib/queries'

export const load = async () => {
  const galleries = await client.fetch(galleriesQ)
  return { galleries }
}
