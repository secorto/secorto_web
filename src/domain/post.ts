import type { CollectionKey } from 'astro:content'

/**
 * Colecciones que tienen tags en su schema.
 * Array en runtime — el tipo `CollectionWithTags` se deriva de este constante.
 * Fuente de verdad: si una colección añade `tags` a su schema, agregar aquí.
 */
export const COLLECTIONS_WITH_TAGS = ['blog', 'talk'] as const

export type CollectionWithTags = typeof COLLECTIONS_WITH_TAGS[number]

/**
 * Type guard en runtime: retorna true si la colección tiene tags.
 */
export function isCollectionWithTags(collection: CollectionKey): collection is CollectionWithTags {
  return (COLLECTIONS_WITH_TAGS as readonly string[]).includes(collection)
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
