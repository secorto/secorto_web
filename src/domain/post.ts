import type { CollectionKey, CollectionEntry } from 'astro:content'

export type CollectionWithTags = {
  [K in CollectionKey]: 'tags' extends keyof CollectionEntry<K>['data'] ? K : never
}[CollectionKey]

const TAGS_COLLECTIONS: Record<CollectionWithTags, true> = { blog: true, talk: true }

export function isCollectionWithTags(collection: CollectionKey): collection is CollectionWithTags {
  return collection in TAGS_COLLECTIONS
}

export type PostEntry<C extends CollectionKey> = CollectionEntry<C> & {
  cleanId: string,
  canonicalId: string 
}

/**
 * Contrato mínimo del componente ListPost.
 * Tipo estructural — no re-declara el schema de Astro,
 * solo describe exactamente los campos que ListPost accede.
 * `CollectionEntry<'blog'> & { cleanId: string }` satisface este tipo estructuralmente.
 */
export interface PostLikeEntry {
  cleanId: string
  data: {
    title: string
    image?: ImageMetadata
    excerpt?: string
    date?: Date
  }
}
