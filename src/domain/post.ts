import type { CollectionKey, CollectionEntry } from 'astro:content'

export type CollectionWithTags = {
  [K in CollectionKey]: 'tags' extends keyof CollectionEntry<K>['data'] ? K : never
}[CollectionKey]

const TAGS_COLLECTIONS: Record<CollectionWithTags, true> = { blog: true, talk: true }

export function isCollectionWithTags(collection: CollectionKey): collection is CollectionWithTags {
  return collection in TAGS_COLLECTIONS
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

/**
 * Contrato mínimo del componente ListWork.
 * Tipo estructural — describe exactamente los campos que ListWork accede.
 * `CollectionEntry<'work'> & { cleanId: string }` satisface este tipo estructuralmente.
 */
export interface WorkLikeEntry {
  cleanId: string
  data: {
    title: string
    image: ImageMetadata
    role: string
    responsibilities: string
    startDate: Date
    endDate?: Date
  }
}
