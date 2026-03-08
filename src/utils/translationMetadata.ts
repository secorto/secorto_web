/**
 * Utilidades para manejar metadata de traducciones y URLs canónicas en entradas de contenido
 */
import type { UILanguages } from '@i18n/ui'

export interface TranslationOrigin {
  locale: string
  id: string
}

export interface TranslationMetadata {
  canonicalLocale: UILanguages
  canonicalId: string
  shouldNoindex: boolean
}

export interface PageData {
  title?: string
  excerpt?: string
  description?: string
  [key: string]: unknown
}

/**
 * Calcula el locale e ID canónicos para una entrada de contenido,
 * teniendo en cuenta traducciones en estado borrador que deben apuntar a su origen.
 *
 * @param params - Metadatos de la entrada
 * @param params.entryDraft - Frontmatter explícito `draft` para la entrada
 * @param params.translationOrigin - Locale/ID de origen si es una traducción
 * @param params.currentLocale - Locale actual que se está viendo
 * @param params.currentCleanId - ID limpio de la entrada actual
 * @returns Metadatos canónicos para SEO
 *
 * @example
 * ```ts
 * // Traducción en borrador - debe apuntar al original (usar frontmatter `draft: true`)
 * getCanonicalMetadata({
 *   entryDraft: true,
 *   translationOrigin: { locale: 'es', id: '2026-01-01-post' },
 *   currentLocale: 'en',
 *   currentCleanId: '2026-01-01-post'
 * })
 * // Devuelve: { canonicalLocale: 'es', canonicalId: '2026-01-01-post', shouldNoindex: true }
 *
 * // Traducción completa - lo canónico es la propia entrada
 * getCanonicalMetadata({
 *   entryDraft: false,
 *   currentLocale: 'en',
 *   currentCleanId: '2026-01-01-post'
 * })
 * // Devuelve: { canonicalLocale: 'en', canonicalId: '2026-01-01-post', shouldNoindex: false }
 * ```
 */
export function getCanonicalMetadata(params: {
  /**
   * Prefer explicit `draft` frontmatter. If `draft` is true and a
   * `translationOrigin` is provided, canonical points to the origin.
   */
  entryDraft?: boolean
  translationOrigin?: TranslationOrigin
  currentLocale: UILanguages
  currentCleanId: string
}): TranslationMetadata {
  const isDraft = Boolean(params.entryDraft)

  const canonicalLocale = isDraft && params.translationOrigin
    ? (params.translationOrigin.locale as UILanguages)
    : params.currentLocale

  const canonicalId = isDraft && params.translationOrigin
    ? params.translationOrigin.id
    : params.currentCleanId

  return {
    canonicalLocale,
    canonicalId,
    shouldNoindex: isDraft
  }
}

/**
 * Extrae metadata de página (título y descripción) desde una entrada de contenido
 *
 * @param entry - Entrada de contenido
 * @param fallbackTitle - Título por defecto si `entry.data.title` no está definido
 * @returns Objeto con `pageTitle` y `pageDescription`
 *
 * @example
 * ```ts
 * getPageMetadata(entry, 'Blog')
 * // Devuelve: { pageTitle: 'Título del post', pageDescription: 'Este es el extracto...' }
 * ```
 */
export function getPageMetadata(
  entry: { data: PageData },
  fallbackTitle: string
): { pageTitle: string; pageDescription: string } {
  return {
    pageTitle: entry.data.title || fallbackTitle,
    pageDescription: entry.data.excerpt || entry.data.description || ''
  }
}
