import type { CollectionKey, CollectionEntry } from 'astro:content'

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

/**
 * Contrato mínimo para entradas de tipo "experience" (work/projects/community).
 * Tipo estructural — no re-declara el schema de Astro,
 * solo describe exactamente los campos que ListWork y WorkDateRange acceden.
 * Las tres colecciones satisfacen este tipo: work tiene startDate requerido,
 * projects y community no lo tienen, pero el tipo los acepta como opcionales.
 */
export interface ExperienceLikeEntry {
  cleanId: string
  data: {
    title: string
    image?: ImageMetadata
    role?: string
    responsibilities?: string
    startDate?: Date
    endDate?: Date
    website?: string
  }
}
