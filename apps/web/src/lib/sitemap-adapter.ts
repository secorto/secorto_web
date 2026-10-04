/**
 * Sitemap generation adapter for asymmetric multilingual routing.
 *
 * Integrates the i18n package's sitemap builders with the web app's
 * content structure and routing configuration.
 */

import { getCollection, type CollectionEntry } from 'astro:content'
import {
  generateSitemapXml,
  createSectionTagTranslationLinks,
  availableLink,
  type SitemapUrlEntry,
  createTranslationIndex,
  availableAtLocale,
  withTag,
  resolveDefaultAvailableLink,
  createDetailTranslationLinks,
} from '@secorto/i18n'
import { adaptToLocalizedEntry } from '@secorto/i18n'
import { sectionRoutes, type SectionType } from '@domain/section'
import { tagRoutes } from '@domain/tags'
import { languages, defaultLang, type UILanguages } from '@i18n/ui'

/**
 * Generates sitemap entries for a single content section.
 *
 * Applies the appropriate mapper (with/without lastmod) based on section type,
 * building translation links from per-mapper siblings (the translationIndex).
 *
 * @param section Content section type
 * @returns Array of SitemapUrlEntry for all accessible detail entries in this section
 */
async function generateSectionContentEntries(
  section: SectionType,
  rawEntries: CollectionEntry<SectionType>[],
): Promise<SitemapUrlEntry<UILanguages>[]> {
  const allEntries: SitemapUrlEntry<UILanguages>[] = []

  const localizedEntries = rawEntries.map(entry =>
    adaptToLocalizedEntry(entry, languages)
  )
  const translationIndex = createTranslationIndex(localizedEntries)

  for (const entry of localizedEntries) {
    if(entry.draft) continue
    const siblings = translationIndex[entry.translationKey]
    const translationLinks = createDetailTranslationLinks(siblings, sectionRoutes, languages)
    const defaultLink = resolveDefaultAvailableLink(translationLinks, defaultLang)
    allEntries.push({
      href: sectionRoutes.getEntryPath(section, entry.locale, entry.cleanId),
      locale: entry.locale,
      translationLinks,
      changefreq: 'weekly',
      priority: 0.8,
      defaultLink,
    })
  }

  return allEntries
}

/**
 * Generates sitemap entry for locale home pages (root /, /en, /es).
 *
 * @returns Locale home page entry with translation links to all locale variants
 */
function generateLocaleHomeEntries(): SitemapUrlEntry<UILanguages>[] {
  const localeLinksArray = languages.all.map(locale =>
    availableLink(`${languages.getPath(locale)}/`, locale)
  )
  const defaultLink = availableLink(`${languages.getPath(defaultLang)}/`, defaultLang)

  return languages.all.map(locale => {
    return {
      href: `${languages.getPath(locale)}/`,
      locale: locale,
      translationLinks: localeLinksArray,
      changefreq: 'monthly',
      priority: 1.0,
      defaultLink,
    }
  })
}

/**
 * Generates sitemap entries for all section listing pages.
 *
 * One entry per section with translation links to localized section paths.
 * Example: /blog ↔ /bitacora
 *
 * @returns Array of section listing entries (one per section in sectionRoutes)
 */
function generateSectionListingEntries(section: SectionType): SitemapUrlEntry<UILanguages>[] {
  const sitemapEntries: SitemapUrlEntry<UILanguages>[] = []
  const links = languages.all.map(locale =>
    availableLink(`${sectionRoutes.getSectionPath(section, locale)}`, locale)
  )
  const defaultLink = availableLink(`${sectionRoutes.getSectionPath(section, defaultLang)}`, defaultLang)
  for (const locale of languages.all) {
    sitemapEntries.push({
      href: sectionRoutes.getSectionPath(section, locale),
      locale: locale,
      translationLinks: links,
      changefreq: 'weekly',
      priority: 0.8,
      defaultLink,
    })
  }

  return sitemapEntries
}

/**
 * Generates sitemap entries for all detail pages across all sections.
 *
 * Each section's detail entries (blog posts, talks, work items, etc.)
 * are generated via mappers that handle section-specific metadata (lastmod, changefreq).
 *
 * @returns Array of all detail entries from all sections
 */
async function generateSectionEntries(): Promise<SitemapUrlEntry<UILanguages>[]> {
  const allEntries: SitemapUrlEntry<UILanguages>[] = []

  for (const section of sectionRoutes.getSections()) {
    const collection = await getCollection(section)
    const sectionListingEntries = generateSectionListingEntries(section)
    allEntries.push(...sectionListingEntries)
    const sectionEntries = await generateSectionContentEntries(section, collection)
    allEntries.push(...sectionEntries)
    const tagEntries = await generateSectionTagEntries(section, collection)
    allEntries.push(...tagEntries)
  }

  return allEntries
}

/**
 * Generates sitemap entries for all tag pages across all sections.
 *
 * Extracts available tag/locale combinations from static path generation,
 * builds translation links, and creates one sitemap entry per unique tag
 * (across all its locales).
 *
 * @returns Array of tag page entries
 */
async function generateSectionTagEntries(
  section: SectionType,
  contentEntries: CollectionEntry<SectionType>[]): Promise<SitemapUrlEntry<UILanguages>[]> {
  const sitemapEntries: SitemapUrlEntry<UILanguages>[] = []
  
  for (const tag of tagRoutes.getTags()) {
    const entriesWithTag =
          contentEntries.filter(withTag(tag))

    const siblings =
      languages.all.filter(locale =>
        entriesWithTag.some(
          availableAtLocale(locale),
        ),
      )

    // Omit tag if there's not content in the section for any locale
    if(siblings.length === 0) continue
    
    const tagLinks = createSectionTagTranslationLinks(
      languages.all,
      siblings,
      section,
      tag,
      tagRoutes
    )
    const defaultLink = resolveDefaultAvailableLink(tagLinks, defaultLang)
    if(defaultLink === undefined) throw new Error(`Failed to resolve default available link for tag: ${tag}`)
    for (const locale of siblings) {
      sitemapEntries.push({
        href: tagRoutes.getSectionTagPath(section, locale, tag),
        locale,
        translationLinks: tagLinks,
        changefreq: 'weekly',
        priority: 0.6,
        defaultLink,
      })
    }
  }

  return sitemapEntries
}

/**
 * Generates the complete sitemap XML for the site.
 *
 * Orchestrates four levels of sitemap content:
 * 1. Locale home pages (/)
 * 2. Section listing pages (/blog, /bitacora, etc.)
 * 3. Section detail pages (blog posts, talks, work items, etc.)
 * 4. Tag pages (tags within each section)
 *
 * @returns XML string ready to serve as sitemap.xml
 */
export async function generateSitemap(): Promise<string> {
  const allEntries: SitemapUrlEntry<UILanguages>[] = [
    ...generateLocaleHomeEntries(),
    ...await generateSectionEntries(),
  ]

  return generateSitemapXml(allEntries)
}
