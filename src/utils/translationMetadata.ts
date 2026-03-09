/**
 * Utilidades para manejar metadata de traducciones y URLs canónicas en entradas de contenido
 */
import type { UILanguages } from '@i18n/ui'

export interface TranslationMetadata {
  canonicalLocale: UILanguages
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
 * @param params.currentLocale - Locale actual que se está viendo
 * @param params.currentCleanId - ID limpio de la entrada actual
 * @param params.seriesCanonicalLocale - Locale canónico de la serie (calculado desde locales disponibles, por defecto `es`)
 * @returns Metadatos canónicos para SEO
 *
 * @example
 * ```ts
 * // Traducción en borrador - apunta al original es
 * getCanonicalMetadata({
 *   entryDraft: true,
 *   currentLocale: 'en',
 *   currentCleanId: '2026-01-01-post',
 *   seriesCanonicalLocale: 'es'
 * })
 * // Devuelve: { canonicalLocale: 'es', shouldNoindex: true }
 *
 * // Traducción publicada - canónico es self
 * getCanonicalMetadata({
 *   entryDraft: false,
 *   currentLocale: 'en',
 *   currentCleanId: '2026-01-01-post'
 * })
 * // Devuelve: { canonicalLocale: 'en', shouldNoindex: false }
 * ```
 */
export function getCanonicalMetadata(params: {
  entryDraft?: boolean
  currentLocale: UILanguages
  currentCleanId: string
  /** Locale canónico de la serie; si omitido se usa currentLocale */
  seriesCanonicalLocale?: UILanguages
}): TranslationMetadata {
  const isDraft = Boolean(params.entryDraft)

  const canonicalLocale = isDraft && params.seriesCanonicalLocale
    ? params.seriesCanonicalLocale
    : params.currentLocale

  return {
    canonicalLocale,
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
