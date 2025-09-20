import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { env as publicEnv } from '$env/dynamic/public';
import type {SanityImageSource} from "@sanity/image-url/lib/types/types";

if (
  !publicEnv.PUBLIC_SANITY_PROJECT_ID ||
  !publicEnv.PUBLIC_SANITY_DATASET ||
  !publicEnv.PUBLIC_SANITY_API_VERSION
) {
  throw new Error(
    'Missing Sanity env vars. Check .env(.local): PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET, PUBLIC_SANITY_API_VERSION'
  );
}

export const client = createClient({
  projectId: publicEnv.PUBLIC_SANITY_PROJECT_ID,
  dataset: publicEnv.PUBLIC_SANITY_DATASET,
  apiVersion: publicEnv.PUBLIC_SANITY_API_VERSION,
  useCdn: true
});

const builder = imageUrlBuilder(client);
export const urlFor = (src: unknown) => builder.image(<SanityImageSource>src);
