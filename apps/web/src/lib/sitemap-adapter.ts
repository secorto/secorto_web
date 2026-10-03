/**
 * Sitemap generation adapter for asymmetric multilingual routing.
 *
 * Integrates the i18n package's sitemap builders with the web app's
 * content structure and routing configuration.
 */

import { getCollection } from 'astro:content'
import {
  generateSitemapXml,
  getStaticPathsSectionTags,
  createDetailTranslationLinks,
  createSectionTagTranslationLinks,
  availableLink,
  resolveDefaultAccessibleLink,
  type LocalizedEntry,
  type SitemapUrlEntry,
} from '@secorto/i18n'
import { adaptToLocalizedEntry } from '@secorto/i18n'
import { isAccessible } from '@domain/translationLink'
import { sectionRoutes, type SectionType } from '@domain/section'
import { tagRoutes } from '@domain/tags'
import { languages, defaultLang } from '@i18n/ui'

type Locale = typeof languages.all[number]

type ChangeFreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

/**
 * Mapper type: converts LocalizedEntry + metadata into final SitemapUrlEntry.
 */
type EntryMapper = (
  entry: LocalizedEntry<SectionType, any, Locale>,
  href: string,
  translationKey: string,
  locale: Locale,
  translationLinks: Array<import('@secorto/i18n').TranslationLink<Locale>>
) => SitemapUrlEntry<Locale>

/**
 * Creates a mapper for entries with lastmod.
 */
function createMapperWithLastmod(changefreq: ChangeFreq, priority: number): EntryMapper {
  return (entry, href, translationKey, locale, translationLinks) => ({
    href,
    translationKey,
    locale,
    translationLinks,
    changefreq,
    priority,
    lastmod: (entry.original.data as { date: Date }).date.toISOString().split('T')[0],
    defaultLocale: defaultLang as Locale,
  })
}

/**
 * Creates a mapper for entries without lastmod.
 */
function createMapperSimple(changefreq: ChangeFreq, priority: number): EntryMapper {
  return (entry, href, translationKey, locale, translationLinks) => ({
    href,
    translationKey,
    locale,
    translationLinks,
    changefreq,
    priority,
    defaultLocale: defaultLang as Locale,
  })
}

/**
 * Factory for creating a base SitemapUrlEntry with all mandatory parameters.
 *
 * @param href Path for this entry (relative to site root)
 * @param translationKey Key for grouping translations
 * @param locale Primary locale for this entry
 * @param translationLinks Array of translation links
 * @param changefreq Change frequency hint
 * @param priority Priority value (0.0-1.0)
 * @param lastmod Optional last modification date
 * @returns Complete SitemapUrlEntry
 */
function createSitemapEntry(
  href: string,
  translationKey: string,
  locale: Locale,
  translationLinks: Array<import('@secorto/i18n').TranslationLink<Locale>>,
  changefreq: ChangeFreq,
  priority: number,
  lastmod?: string
): SitemapUrlEntry<Locale> {
  const entry: SitemapUrlEntry<Locale> = {
    href,
    translationKey,
    locale,
    translationLinks,
    changefreq,
    priority,
    defaultLocale: defaultLang as Locale,
  }

  if (lastmod) {
    entry.lastmod = lastmod
  }

  return entry
}

/**
 * Section-specific mappers.
 */
const sectionMappers: Record<SectionType, EntryMapper> = {
  blog: createMapperWithLastmod('weekly', 0.7),
  talk: createMapperWithLastmod('monthly', 0.6),
  work: createMapperSimple('yearly', 0.5),
  projects: createMapperSimple('monthly', 0.6),
  community: createMapperSimple('monthly', 0.5),
}

/**
 * Generates the complete sitemap XML for the site.
 *
 * Each entry includes translationLinks for all its locale variants,
 * computed upfront per content item.
 *
 * @param site Base site URL (without trailing slash)
 * @returns XML string ready to serve as sitemap.xml
 */
export async function generateSitemap(site: string): Promise<string> {
  const allEntries: SitemapUrlEntry<Locale>[] = []

  // Locale home pages
  const localeLinksArray = languages.all.map(locale =>
    availableLink(`${languages.getPath(locale)}/`, locale)
  )
  const defaultLink = localeLinksArray.find(link => link.locale === defaultLang)
  if (defaultLink && defaultLink.href) {
    allEntries.push({
      href: defaultLink.href,
      translationKey: 'locale',
      locale: defaultLang as Locale,
      translationLinks: localeLinksArray,
      changefreq: 'monthly',
      priority: 1.0,
      defaultLocale: defaultLang as Locale,
    })
  }

  // Section listing pages
  for (const section of sectionRoutes.getSections()) {
    const sectionLinksArray = languages.all.map(locale =>
      availableLink(`${sectionRoutes.getSectionPath(section, locale)}`, locale)
    )
    const defaultLink = sectionLinksArray.find(link => link.locale === defaultLang)
    if (defaultLink && defaultLink.href) {
      allEntries.push({
        href: defaultLink.href,
        translationKey: `section:${String(section)}`,
        locale: defaultLang as Locale,
        translationLinks: sectionLinksArray,
        changefreq: 'weekly',
        priority: 0.8,
        defaultLocale: defaultLang as Locale,
      })
    }
  }

  // Detail entries
  for (const section of sectionRoutes.getSections()) {
    const entries = await getCollection(section)
    const mapper = sectionMappers[section]

    // Group entries by translationKey to build siblings map
    const entriesByKey = new Map<string, LocalizedEntry<SectionType, any, Locale>[]>()
    for (const entry of entries) {
      const localizedEntry = adaptToLocalizedEntry(entry, languages) as LocalizedEntry<
        SectionType,
        any,
        Locale
      >
      const key = localizedEntry.translationKey
      if (!entriesByKey.has(key)) {
        entriesByKey.set(key, [])
      }
      entriesByKey.get(key)!.push(localizedEntry)
    }

    // Process each translation group
    for (const [translationKey, localeEntries] of entriesByKey) {
      // Build siblings map for this translation key
      const siblings = Object.fromEntries(
        localeEntries.map(entry => [entry.locale, entry])
      ) as Partial<Record<Locale, LocalizedEntry<SectionType, any, Locale>>>

      // Create proper translation links (available, draft, or missing)
      const allLinks = createDetailTranslationLinks(siblings, sectionRoutes, languages)

      if (allLinks.length === 0) continue

      // Use resolveDefaultAccessibleLink to get the best entry for sitemap
      const defaultLink = resolveDefaultAccessibleLink(allLinks, defaultLang as Locale)
      const locEntryForLink = siblings[defaultLink.locale]

      if (defaultLink.href && locEntryForLink) {
        allEntries.push(
          mapper(
            locEntryForLink,
            defaultLink.href,
            translationKey,
            defaultLink.locale,
            allLinks
          )
        )
      }
    }
  }

  // Tag pages
  const tagPaths = await getStaticPathsSectionTags(
    languages,
    sectionRoutes,
    tagRoutes,
    (sec: SectionType) => getCollection(sec) as any,
  )

  const processedTags = new Set<string>()
  for (const tagPath of tagPaths) {
    const section = tagPath.props.section
    const tag = tagPath.props.tag
    const key = `tag:${String(section)}:${String(tag)}`

    if (!processedTags.has(key)) {
      processedTags.add(key)

      // Create proper translation links for tag pages
      const allLinks = createSectionTagTranslationLinks(
        languages.all,
        tagPath.props.siblings,
        section,
        tag,
        tagRoutes
      )

      if (allLinks.length === 0) continue

      // Use resolveDefaultAccessibleLink to get the best entry for sitemap
      const defaultLink = resolveDefaultAccessibleLink(allLinks, defaultLang as Locale)

      if (defaultLink.href) {
        allEntries.push({
          href: defaultLink.href,
          translationKey: key,
          locale: defaultLink.locale,
          translationLinks: allLinks,
          changefreq: 'weekly',
          priority: 0.6,
          defaultLocale: defaultLang as Locale,
        })
      }
    }
  }

  // Generate XML from entries
  const xml = generateSitemapXml(allEntries)

  return xml
}
