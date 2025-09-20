import type { PageServerLoad } from './$types'
import { client } from '$lib/sanity'

const SLUG = 'paul-pp'
const q = `*[_type=="photo" && slug.current==$slug && published==true][0]{
  alt, caption, image
}`

export const load: PageServerLoad = async () => {
  const photo = await client.fetch(q, { slug: SLUG })
  return { photo }
}
