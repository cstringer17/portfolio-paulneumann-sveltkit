import { client } from '$lib/sanity'
import { storyQ } from '$lib/queries'

export const load = async ({ params }) => {
  const story = await client.fetch(storyQ, { slug: params.slug })
  if (!story) {
    return {
      status: 404,
      error: new Error('Story not found')
    }
  }
  return { story }
}
