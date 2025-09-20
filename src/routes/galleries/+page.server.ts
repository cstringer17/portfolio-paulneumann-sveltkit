// src/routes/galleries/+page.server.ts
import { getGalleries } from '$lib/data/getGalleries'

export const load = async ({ url }) => {
  const page  = Number(url.searchParams.get('page')  ?? '1')
  const limit = Number(url.searchParams.get('limit') ?? '24')
  const offset = Math.max(0, (page - 1) * limit)

  const { galleries, pagination } = await getGalleries({ offset, limit })
  return {
    galleries,
    layout: { header: true, footer: true },
    pagination: { ...pagination, page }
  }
}
