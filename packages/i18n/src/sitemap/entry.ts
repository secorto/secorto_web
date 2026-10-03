/**
 * Sitemap entry types for asymmetric multilingual routing.
 *
 * Supports generation of sitemap XML with hreflang alternates,
 * grouping URLs by translation key for consistency.
 */

import type { TranslationLink } from '../core/translationLink'

/**
 * Represents a single URL entry in a sitemap.
 *
 * @template TLocale The locale type.
 */
export interface SitemapUrlEntry<TLocale extends string> {
  /**
   * The path for this entry (relative to site root).
   */
  href: string

  /**
   * Timestamp of last modification (ISO 8601 format).
   * Optional; omitted if not provided.
   */
  lastmod?: string

  /**
   * Sitemap change frequency hint (values from sitemap spec).
   */
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

  /**
   * Priority hint (0.0 to 1.0).
   */
  priority: number

  /**
   * Language/locale for this URL.
   */
  locale: TLocale

  /**
   * Translation key for grouping this URL with its siblings.
   * All sibling translations share the same key for hreflang generation.
   */
  translationKey: string

  /**
   * Translation links for all locales for this content.
   * Used for hreflang alternate generation.
   */
  translationLinks: TranslationLink<TLocale>[]

  /**
   * Locale to use as x-default hreflang.
   */
  defaultLocale: TLocale
}

/**
 * Function to convert a LocalizedEntry to a SitemapUrlEntry.
 * The app provides this to decide how to map content metadata (dates, etc.)
 * to sitemap fields, keeping the library agnostic.
 *
 * @template TSection Section identifier.
 * @template TEntry The collection entry type.
 * @template TLocale Locale identifier.
 */
export type LocalizedEntryMapper<
  TSection extends string,
  TEntry extends object,
  TLocale extends string
> = (
  entry: import('../section/translation-index').LocalizedEntry<TSection, TEntry, TLocale>
) => SitemapUrlEntry<TLocale>
