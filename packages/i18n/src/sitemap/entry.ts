/**
 * Sitemap entry types for asymmetric multilingual routing.
 */

import type { TranslationLink, AvailableLink } from '../core/translationLink'

/**
 * Represents a single URL entry in a sitemap.
 *
 * @template TLocale The locale type.
 */
export interface SitemapEntry<TLocale extends string> {
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
   * Translation links for all locales for this content.
   * Used for hreflang alternate generation.
   */
  translationLinks: TranslationLink<TLocale>[]

  /**
   * Locale to use as x-default hreflang.
   */
  defaultLink?: AvailableLink<TLocale>
}
