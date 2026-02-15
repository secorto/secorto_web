/**
 * Utilities for handling translation metadata and canonical URLs in content entries
 */
import type { UILanguages } from '@i18n/ui'

export interface TranslationOrigin {
  locale: string
  id: string
}

export interface TranslationMetadata {
  isTranslationDraft: boolean
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
 * Calculates the canonical locale and ID for a content entry,
 * taking into account translation drafts that should point to their originals
 *
 * @param params - Entry metadata
 * @param params.entryDraft - Explicit `draft` frontmatter for the entry
 * @param params.translationOrigin - Origin locale/ID if this is a translation
 * @param params.currentLocale - Current locale being viewed
 * @param params.currentCleanId - Current entry's clean ID
 * @returns Canonical metadata for SEO
 *
 * @example
 * ```ts
 * // Translation draft - should point to original
 * getCanonicalMetadata({
 *   translationStatus: 'draft',
 *   translationOrigin: { locale: 'es', id: '2026-01-01-post' },
 *   currentLocale: 'en',
 *   currentCleanId: '2026-01-01-post'
 * })
 * // Returns: { canonicalLocale: 'es', canonicalId: '2026-01-01-post', isTranslationDraft: true, shouldNoindex: true }
 *
 * // Complete translation - canonical is self
 * getCanonicalMetadata({
 *   translationStatus: 'translated',
 *   currentLocale: 'en',
 *   currentCleanId: '2026-01-01-post'
 * })
 * // Returns: { canonicalLocale: 'en', canonicalId: '2026-01-01-post', isTranslationDraft: false, shouldNoindex: false }
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
    isTranslationDraft: isDraft,
    canonicalLocale,
    canonicalId,
    shouldNoindex: isDraft
  }
}

/**
 * Extracts page metadata (title and description) from a content entry
 *
 * @param entry - Content entry
 * @param fallbackTitle - Fallback title if entry.data.title is not set
 * @returns Object with pageTitle and pageDescription
 *
 * @example
 * ```ts
 * getPageMetadata(entry, 'Blog')
 * // Returns: { pageTitle: 'My Post Title', pageDescription: 'This is the excerpt...' }
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
