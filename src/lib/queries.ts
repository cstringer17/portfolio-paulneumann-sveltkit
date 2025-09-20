// queries.ts

// Reusable field snippets
export const imageMeta = `
  "assetId": image.asset->_id,
  "lqip": image.asset->metadata.lqip,
  "aspectRatio": image.asset->metadata.dimensions.aspectRatio,
  "dimensions": image.asset->metadata.dimensions,
  "palette": image.asset->metadata.palette,
  "hotspot": image.hotspot,
  "crop": image.crop
`


export const photoCore = `
  _id,
  title,
  "slug": slug.current,
  alt,
  image,
  ${imageMeta},
  caption,
  shotAt,
  location,
  exif,
  order,
  "tags": tags[]->{
    _id, title, "slug": slug.current
  }
`

/* =========================
   Galleries
   ========================= */

// All galleries (homepage grid) — paginated
export const galleriesQ = `
*[_type=="gallery" && published==true && defined(cover)]
| order(title asc)[$offset...$end]{
  _id,
  title,
  "slug": slug.current,
  cover->{ _id, title, alt, image, ${imageMeta}, order },
  // hero: photo with tag "hero" -> cover -> first by order
  "heroPhoto": coalesce(
    photos[@->tags[]->slug.current match "hero"][0]->{
      _id, title, alt, image, ${imageMeta}, order
    },
    cover->{ _id, title, alt, image, ${imageMeta}, order },
    photos[]->|order(coalesce(order, 999999) asc)[0]{
      _id, title, alt, image, ${imageMeta}, order
    }
  )
}
`

// Single gallery (detail)
export const galleryQ = `
*[_type=="gallery" && slug.current==$slug && published==true][0]{
  _id,
  title,
  description,
  "heroPhoto": coalesce(
    photos[@->tags[]->slug.current match "hero"][0]->{
      _id, title, alt, image, ${imageMeta}, order
    },
    ^.cover->{ _id, title, alt, image, ${imageMeta}, order },
    photos[]->|order(coalesce(order, 999999) asc)[0]{
      _id, title, alt, image, ${imageMeta}, order
    }
  ),
  "photos": photos[]->{
    ${photoCore}
  }|order(coalesce(order, 999999) asc),
  // Precomputed ordering for lightbox stepping
  "photoIdsOrdered": photos[]->._id|order(coalesce(^.order, 999999) asc)
}
`

/* =========================
   Photos
   ========================= */

// Latest photos (global feed)
export const latestPhotosQ = `
*[_type=="photo" && published==true]
| order(coalesce(publishedAt, _createdAt) desc)[0...24]{
  ${photoCore}
}
`

// Photos by tag slug
export const photosByTagQ = `
*[_type=="photo" && published==true && $tag in tags[]->slug.current]
| order(coalesce(order, 999999) asc){
  ${photoCore}
}
`

/* =========================
   Stories
   ========================= */

// Stories list — paginated
export const storiesQ = `
*[_type=="story" && published==true]
| order(date desc)[$offset...$end]{
  title,
  "slug": slug.current,
  excerpt,
  date,
  cover{ ..., ${imageMeta} },
  "tags": tags[]->{
    _id, title, "slug": slug.current
  }
}
`

// Single story
export const storyQ = `
*[_type=="story" && slug.current==$slug && published==true][0]{
  title,
  "slug": slug.current,
  date,
  excerpt,
  cover{ ..., ${imageMeta} },
  body[]{
    ...,
    _type == "figure" => {
      ...,
      ${imageMeta}
    }
  },
  "tags": tags[]->{
    _id, title, "slug": slug.current
  },
  relatedGallery->{
    _id, title, "slug": slug.current,
    cover->{ _id, title, alt, image, ${imageMeta} }
  }
}
`

/* =========================
   Featured / discovery
   ========================= */

export const featuredGalleriesQ = `
*[_type=="gallery" && published==true && featured==true]
| order(publishedAt desc)[0...6]{
  _id, title, "slug": slug.current,
  cover->{ _id, title, alt, image, ${imageMeta} }
}
`

/* =========================
   Slugs for routing/sitemaps
   ========================= */

export const gallerySlugsQ = `*[_type=="gallery" && published==true].slug.current`
export const storySlugsQ   = `*[_type=="story" && published==true].slug.current`
export const photoSlugsQ   = `*[_type=="photo" && published==true].slug.current`
