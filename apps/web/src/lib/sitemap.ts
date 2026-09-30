/**
 * Sitemap generation adapter for secorto.com
 *
 * Integrates the asymmetric multilingual sitemap builder with the site's
 * specific content structure, routing configuration, and metadata.
 */

import { getCollection } from 'astro:content'
import {
  adaptToLocalizedEntry,
  localePathsSitemapEntries,
  sectionPathsSitemapEntries,
  detailPathsSitemapEntries,
  tagPathsSitemapEntries,
  toSitemapXml,
  type SitemapEntry,
  type SitemapOptions,
} from '@secorto/i18n'
import { sectionRoutes, type SectionType } from '@domain/section'
import { tagRoutes } from '@domain/tags'
import { languages } from '@i18n/ui'

/**
 * Generates the complete sitemap XML for the site.
 *
 * Combines entries from:
 * - Locale paths (home pages)
 * - Section listing pages
 * - Detail pages (blog posts, talks, projects, etc.)
 * - Tag pages
 *
 * Only includes available content (drafts are excluded unless explicitly enabled).
 *
 * @param options Sitemap generation options
 * @returns XML string ready to serve as sitemap.xml
 */
export async function generateSitemap(options: SitemapOptions): Promise<string> {
  const allEntries: SitemapEntry<typeof languages.all[0]>[] = []

  // 1. Add locale root paths (e.g., /, /es, /en)
  const localePaths = localePathsSitemapEntries(languages)
  allEntries.push(...localePaths)

  // 2. Add section listing pages (e.g., /es/blog, /en/talk)
  const sectionPaths = await sectionPathsSitemapEntries(sectionRoutes, languages)
  allEntries.push(...sectionPaths)

  // 3. Add detail pages from all sections with asymmetric routing
  for (const sectionKey of sectionRoutes.getSections()) {
    const entries = await getCollection(sectionKey as SectionType)
    const localizedEntries = entries.map(entry =>
      adaptToLocalizedEntry(entry, languages),
    )

    const detailEntries = detailPathsSitemapEntries(
      localizedEntries,
      sectionRoutes,
      languages,
      { ...options, includeDrafts: false }, // Exclude drafts from public sitemap
    )
    allEntries.push(...detailEntries)
  }

  // 4. Add tag pages (grouped by section and locale)
  for (const sectionKey of sectionRoutes.getSections()) {
    const entries = await getCollection(sectionKey as SectionType)
    const localizedEntries = entries.map(entry =>
      adaptToLocalizedEntry(entry, languages),
    )

    // Group tags by locale
    const tagsByLocale = new Map<typeof languages.all[0], Set<string>>()

    for (const entry of localizedEntries) {
      // Skip draft entries when collecting tags
      if (entry.draft) continue

      const originalData = entry.original.data as any
      const tags = originalData.tags || []

      if (!tagsByLocale.has(entry.locale)) {
        tagsByLocale.set(entry.locale, new Set())
      }

      tags.forEach((tag: string) => {
        tagsByLocale.get(entry.locale)!.add(tag)
      })
    }

    // Convert sets to arrays for the tag routes function
    const tagsMap = new Map<typeof languages.all[0], readonly string[]>()
    for (const [locale, tagsSet] of tagsByLocale) {
      tagsMap.set(locale, Array.from(tagsSet))
    }

    // Only generate tag pages if we have tags for this section
    if (tagsMap.size > 0) {
      const tagEntries = tagPathsSitemapEntries(
        sectionKey as SectionType,
        tagsMap,
        sectionRoutes,
        tagRoutes,
        languages,
      )
      allEntries.push(...tagEntries)
    }
  }

  // Convert to XML
  return toSitemapXml(allEntries, options)
}

/**
 * Generates only the detail page entries for a specific section.
 * Useful for testing or selective sitemap generation.
 *
 * @param section Section identifier (e.g., 'blog', 'talk')
 * @param options Sitemap generation options
 * @returns Array of sitemap entries
 */
export async function generateSectionDetailEntries(
  section: SectionType,
  options: SitemapOptions = {},
): Promise<SitemapEntry<typeof languages.all[0]>[]> {
  const entries = await getCollection(section)
  const localizedEntries = entries.map(entry =>
    adaptToLocalizedEntry(entry, languages),
  )

  return detailPathsSitemapEntries(
    localizedEntries,
    sectionRoutes,
    languages,
    options,
  )
}

/**
 * Validates sitemap XML structure.
 * Returns validation errors or an empty array if valid.
 *
 * @param xml XML string to validate
 * @returns Array of validation error messages
 */
export function validateSitemapXml(xml: string): string[] {
  const errors: string[] = []

  // Check XML declaration
  if (!xml.startsWith('<?xml')) {
    errors.push('Missing XML declaration')
  }

  // Check for required namespace
  if (!xml.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
    errors.push('Missing sitemap namespace')
  }

  // Check for xhtml namespace (for hreflang)
  if (!xml.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"')) {
    errors.push('Missing xhtml namespace for hreflang support')
  }

  // Check for urlset wrapper
  if (!xml.includes('<urlset') || !xml.includes('</urlset>')) {
    errors.push('Missing urlset wrapper')
  }

  // Check that all <url> tags have <loc> child
  const urlMatches = xml.match(/<url>[\s\S]*?<\/url>/g) || []
  for (const urlBlock of urlMatches) {
    if (!urlBlock.includes('<loc>')) {
      errors.push('Found <url> without <loc>')
      break
    }
  }

  return errors
}
