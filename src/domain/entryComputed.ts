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
   * Identificador canónico que agrupa todas las traducciones de una misma pieza.
   * Puede provenir del frontmatter `postId` cuando se desea forzar la relación.
   */
  canonicalId: string
  /**
   * Locale detectado a partir del `entry.id` (p.ej. 'es' o 'en').
   * Opcional: no todas las entradas necesariamente llevan prefijo de locale en el id.
   */
  locale?: UILanguages
}
