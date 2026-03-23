import type { CollectionKey, CollectionEntry } from 'astro:content'

/**
 * Campos computados por nuestro dominio a partir de una CollectionEntry de Astro
 * - `cleanId`: slug controlado por el dominio (sin prefijo de locale)
 * - `canonicalId`: id que agrupa traducciones (puede venir de frontmatter `postId`)
 * - `availableLocales`: mapa minimal de locales disponibles para esta entrada
 */
export interface ComputedFields {
  cleanId: string
  canonicalId: string
}

export type DomainEntry<C extends CollectionKey = CollectionKey> = CollectionEntry<C> & ComputedFields
