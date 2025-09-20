import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import {
  PUBLIC_SANITY_PROJECT_ID,
  PUBLIC_SANITY_DATASET,
  PUBLIC_SANITY_API_VERSION
} from '$env/static/public'

if (!PUBLIC_SANITY_PROJECT_ID || !PUBLIC_SANITY_DATASET || !PUBLIC_SANITY_API_VERSION) {
  throw new Error('Missing Sanity env vars. Check .env(.local): PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET, PUBLIC_SANITY_API_VERSION')
}

export const client = createClient({
  projectId: PUBLIC_SANITY_PROJECT_ID,
  dataset: PUBLIC_SANITY_DATASET,
  apiVersion: PUBLIC_SANITY_API_VERSION,
  useCdn: true
})

const builder = imageUrlBuilder(client)
export const urlFor = (src: any) => builder.image(src)
