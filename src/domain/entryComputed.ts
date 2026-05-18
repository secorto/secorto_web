import type { UILanguages } from '@i18n/ui'

/**
 * Campos computados por nuestro dominio a partir de una CollectionEntry de Astro
 */
export interface ComputedFields {
  /**
   * Slug controlado por el dominio, sin prefijo de locale.
   * Usado para construir rutas públicas y para referenciar el entry en la UI.
   */
  cleanId: string

  /**
  * Identificador que agrupa todas las traducciones de una misma pieza.
  * Proviene del frontmatter `translationKey` cuando se desea forzar la relación,
  * o se deriva del `cleanId` cuando no existe `translationKey`.
  */
  translationKey: string
  /**
   * Locale detectado a partir del `entry.id` (p.ej. 'es' o 'en').
   */
  locale: UILanguages
}
