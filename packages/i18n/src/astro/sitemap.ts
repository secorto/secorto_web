/**
 * Sitemap generation for asymmetric multilingual content systems.
 *
 * This module provides utilities to generate sitemaps that respect:
 * - Content state (available, draft, missing) via TranslationLink types
 * - Asymmetric routing per locale
 * - hreflang links for SEO
 */

import type { Locales } from '../core'
import type { SectionRoutes } from '../section/routes'
import type { TranslationIndex } from '../section/translation-index'
import type { TagRoutes } from '../tags/route'
import type { LocalizedEntry } from '../section/translation-index'

/**
 * Represents a single URL entry in the sitemap with all its translations and metadata.
 */
export interface SitemapEntry<TLocale extends string> {
  /**
   * All available translations for this resource.
   * Keyed by locale; includes both available and draft (but not missing).
   */
  readonly translations: Readonly<Record<TLocale, { href: string; draft: boolean }>>

  /**
   * ISO date of the last modification. Typically extracted from content metadata.
   */
  readonly lastmod?: string

  /**
   * How frequently the page is likely to change.
   */
  readonly changefreq?: 'daily' | 'weekly' | 'monthly' | 'yearly'

  /**
   * Relative priority of the URL within the site (0.0 to 1.0).
   * Default: 0.5
   */
  readonly priority?: number
}

/**
 * Options for sitemap generation.
 */
export interface SitemapOptions {
  /**
   * Site base URL (e.g., 'https://example.com')
   */
  readonly site?: string

  /**
   * Include draft entries in the sitemap.
   * Default: false (drafts are excluded)
   */
  readonly includeDrafts?: boolean
}

/**
 * Generates sitemap entries for locale paths (e.g., home pages per locale).
 *
 * @param locales Supported locales configuration
 * @param lastmod Optional last modified date for all locale pages
 * @returns Array of sitemap entries
 */
export function localePathsSitemapEntries<TLocale extends string>(
  locales: Locales<TLocale>,
  lastmod?: string,
): SitemapEntry<TLocale>[] {
  // All locale home pages share the same translation group, so return a single entry
  const translations = locales.all.reduce((acc, loc) => {
    acc[loc] = { href: locales.getPath(loc), draft: false }
    return acc
  }, {} as Record<TLocale, { href: string; draft: boolean }>)

  return [{
    translations,
    lastmod,
    changefreq: 'daily' as const,
    priority: 0.8,
  }]
}

/**
 * Generates sitemap entries for section listing pages (e.g., /es/blog, /en/talks).
 *
 * @param routes Section routes configuration
 * @param locales Supported locales
 * @param lastmod Optional last modified date
 * @returns Array of sitemap entries
 */
export async function sectionPathsSitemapEntries<
  TSection extends string,
  TLocale extends string
>(
  routes: SectionRoutes<TSection, TLocale>,
  locales: Locales<TLocale>,
  lastmod?: string,
): Promise<SitemapEntry<TLocale>[]> {
  const entries: SitemapEntry<TLocale>[] = []

  for (const sectionKey of routes.getSections()) {
    // For section listing pages, all locales have the same resource
    const translations = {} as Record<TLocale, { href: string; draft: boolean }>

    for (const locale of locales.all) {
      translations[locale] = {
        href: routes.getSectionPath(sectionKey, locale),
        draft: false,
      }
    }

    entries.push({
      translations,
      lastmod,
      changefreq: 'weekly' as const,
      priority: 0.7,
    })
  }

  return entries
}

/**
 * Generates sitemap entries for detail pages with asymmetric routing.
 *
 * Groups translations by translationKey and creates one sitemap entry per translation group.
 * Only includes available entries (or drafts if enabled via options).
 *
 * @template TSection Section type
 * @template TLocale Locale type
 * @template TEntry Content entry type
 *
 * @param entries Localized entries (typically from translation index)
 * @param routes Section routes for URL building
 * @param locales Supported locales
 * @param options Sitemap generation options
 * @returns Array of sitemap entries grouped by translation key
 */
export function detailPathsSitemapEntries<
  TSection extends string,
  TLocale extends string,
  TEntry extends object
>(
  entries: readonly LocalizedEntry<TSection, TEntry, TLocale>[],
  routes: SectionRoutes<TSection, TLocale>,
  locales: Locales<TLocale>,
  options: SitemapOptions = {},
): SitemapEntry<TLocale>[] {
  const { includeDrafts = false } = options

  // Group entries by translation key to handle asymmetric routing
  const groups = new Map<
    string,
    Map<TLocale, LocalizedEntry<TSection, TEntry, TLocale>>
  >()

  for (const entry of entries) {
    const key = entry.translationKey
    if (!groups.has(key)) {
      groups.set(key, new Map())
    }
    groups.get(key)!.set(entry.locale, entry)
  }

  const sitemapEntries: SitemapEntry<TLocale>[] = []

  for (const group of groups.values()) {
    const translations = {} as Record<TLocale, { href: string; draft: boolean }>
    let hasAccessible = false

    for (const [locale, entry] of group) {
      // Filter: include available entries always, drafts only if option is set
      if (!includeDrafts && entry.draft) {
        continue
      }

      hasAccessible = true
      const section = entry.section as TSection
      translations[locale] = {
        href: routes.getEntryPath(section, locale, entry.cleanId),
        draft: entry.draft,
      }
    }

    // Only add if there's at least one accessible entry
    if (hasAccessible) {
      sitemapEntries.push({
        translations,
        // Attempt to extract lastmod from content data if available
        lastmod: (group.get(locales.all[0])?.original as any)?.pubDate,
        changefreq: 'monthly' as const,
        priority: 0.6,
      })
    }
  }

  return sitemapEntries
}

/**
 * Generates sitemap entries for tag pages.
 *
 * @template TTag Tag type
 * @template TSection Section type
 * @template TLocale Locale type
 *
 * @param sectionKey Section identifier
 * @param tags Tags for this section (per locale)
 * @param routes Section routes for URL building
 * @param tagRoutes Tag routes for URL building
 * @param locales Supported locales
 * @returns Array of sitemap entries
 */
export function tagPathsSitemapEntries<
  TTag extends string,
  TSection extends string,
  TLocale extends string
>(
  sectionKey: TSection,
  tags: Map<TLocale, readonly TTag[]>,
  routes: SectionRoutes<TSection, TLocale>,
  tagRoutes: TagRoutes<TTag, TLocale>,
  locales: Locales<TLocale>,
): SitemapEntry<TLocale>[] {
  const entries: SitemapEntry<TLocale>[] = []

  // Collect all unique tags across locales
  const uniqueTags = new Set<TTag>()
  for (const tagList of tags.values()) {
    tagList.forEach(tag => uniqueTags.add(tag))
  }

  // For each tag, create a sitemap entry with translations across locales that have it
  for (const tag of uniqueTags) {
    const translations = {} as Record<TLocale, { href: string; draft: boolean }>

    for (const locale of locales.all) {
      const localeTags = tags.get(locale)
      if (localeTags?.includes(tag)) {
        const tagSlug = tagRoutes.getTagSlug(tag, locale)
        const tagIndex = tagRoutes.getTagIndexSlug(locale)
        translations[locale] = {
          href: `${routes.getSectionPath(sectionKey, locale)}/${tagIndex}/${tagSlug}`,
          draft: false,
        }
      }
    }

    if (Object.keys(translations).length > 0) {
      entries.push({
        translations,
        changefreq: 'weekly' as const,
        priority: 0.5,
      })
    }
  }

  return entries
}

/**
 * Converts sitemap entries to XML format with hreflang links.
 *
 * Generates valid XML that complies with sitemap standards including
 * xhtml:link elements for hreflang alternate links.
 *
 * @param entries Array of sitemap entries
 * @param options Sitemap options (requires 'site')
 * @returns XML string
 */
export function toSitemapXml<TLocale extends string>(
  entries: readonly SitemapEntry<TLocale>[],
  options: SitemapOptions,
): string {
  const { site } = options

  let xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ' +
    'xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'

  for (const entry of entries) {
    // Find the primary URL (preferably non-draft)
    const allTranslations = Object.entries(entry.translations) as Array<
      [TLocale, { href: string; draft: boolean }]
    >
    const primaryUrl = allTranslations.find(([, t]) => !t.draft) || allTranslations[0]

    if (!primaryUrl) continue

    const [, { href: primaryHref }] = primaryUrl

    xml += '  <url>\n'
    xml += `    <loc>${escapeXml(`${site}${primaryHref}`)}</loc>\n`

    if (entry.lastmod) {
      xml += `    <lastmod>${entry.lastmod}</lastmod>\n`
    }

    if (entry.changefreq) {
      xml += `    <changefreq>${entry.changefreq}</changefreq>\n`
    }

    if (entry.priority !== undefined) {
      xml += `    <priority>${entry.priority}</priority>\n`
    }

    // Add hreflang links using locale key directly from allTranslations
    for (const [locale, { href }] of allTranslations) {
      xml += `    <xhtml:link rel="alternate" hreflang="${locale}" href="${escapeXml(`${site}${href}`)}" />\n`
    }

    xml += '  </url>\n'
  }

  xml += '</urlset>'

  return xml
}

/**
 * Escapes XML special characters.
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
