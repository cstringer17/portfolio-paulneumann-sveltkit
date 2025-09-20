import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import { env as publicEnv } from '$env/dynamic/public';
import type {SanityImageSource} from "@sanity/image-url/lib/types/types";

const projectId = publicEnv.PUBLIC_SANITY_PROJECT_ID || '';
const dataset = publicEnv.PUBLIC_SANITY_DATASET || '';
const apiVersion = publicEnv.PUBLIC_SANITY_API_VERSION || '2025-06-01';

// Don’t crash builds if CI envs aren’t present; just warn.
// If these are actually missing at runtime, queries will fail visibly and we’ll see it in logs.
if (!projectId || !dataset || !apiVersion) {
  console.warn(
    '[sanity] Missing PUBLIC_SANITY_* envs. Build continues, but runtime queries may fail. ' +
    'Ensure envs exist in Vercel and locally.'
  );
}

export const client = createClient({
  projectId: projectId || 'placeholder',
  dataset: dataset || 'production',
  apiVersion,
  useCdn: true
});

const builder = imageUrlBuilder(client);
export const urlFor = (src: unknown) => builder.image(<SanityImageSource>src);
