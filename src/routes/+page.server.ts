// src/routes/+page.server.ts
import { getGalleries } from '$lib/data/getGalleries'

export const load = async () => {
  const { galleries, pagination } = await getGalleries({ offset: 0, limit: 24 })
  return {
    galleries,
    layout: { header: false, footer: true },
    pagination
  }
}
