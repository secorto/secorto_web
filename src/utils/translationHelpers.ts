/**
 * Translation utilities for determining locale availability.
 *
 * All functions are pure and synchronous — callers must fetch collection entries with
 * `getCollection` before calling these helpers. This avoids redundant `getCollection`
 * calls when the caller already has entries at hand.
 */
import type { CollectionEntry, CollectionKey } from 'astro:content'
import type { UILanguages } from '@i18n/ui'
import { languageKeys } from '@i18n/ui'
import { extractCleanId } from './ids'
import type { AvailableLocales } from '@i18n/languagePickerUtils'

/**
 * Get list of locales where a specific content entry is available.
 *
 * @param allEntries - Pre-fetched collection entries (caller calls getCollection)
 * @param cleanId - Entry slug/ID without locale prefix
 * @returns Array of locale codes where the entry exists
 *
 * @example
 * ```ts
 * const allEntries = await getCollection('blog')
 * const locales = getAvailableLocalesForEntry(allEntries, '2025-01-22-my-post')
 * // Returns: ['es', 'en']
 * ```
 */
export function getAvailableLocalesForEntry(
  allEntries: CollectionEntry<CollectionKey>[],
  cleanId: string
): UILanguages[] {
  return languageKeys.filter((lk) =>
    allEntries.some((e) => e.id.startsWith(`${lk}/`) && extractCleanId(e.id) === cleanId)
  )
}

/**
 * Build a map of available locales for a content entry, including slug and draft status.
 * Used by detail pages to build LanguagePicker links.
 *
 * @param allEntries - Pre-fetched collection entries (caller calls getCollection)
 * @param cleanId - Entry slug/ID without locale prefix
 * @returns AvailableLocales map: locale -> { slug, draft? }
 */
export function getAvailableLocaleEntries(
  allEntries: CollectionEntry<CollectionKey>[],
  cleanId: string
): AvailableLocales {
  const result: AvailableLocales = {}

  for (const lang of languageKeys) {
    const entry = allEntries.find(
      (e) => e.id.startsWith(`${lang}/`) && extractCleanId(e.id) === cleanId
    )
    if (entry) {
      result[lang] = {
        slug: extractCleanId(entry.id),
        draft: Boolean((entry.data as { draft?: boolean }).draft)
      }
    }
  }

  return result
}

/**
 * Builds a full index of tag → locales that have at least one non-draft entry with that tag.
 * Build this once from allEntries, then look up any tag in O(1).
 * Used by tag pages to build LanguagePicker links with availability info.
 *
 * @param allEntries - Pre-fetched collection entries (caller calls getCollection)
 * @returns Record mapping each tag to the set of locales where it is present
 */
export function buildTagLocaleMap(
  allEntries: CollectionEntry<CollectionKey>[]
): Record<string, Set<UILanguages>> {
  const map: Record<string, Set<UILanguages>> = {}

  for (const entry of allEntries) {
    if ((entry.data as { draft?: boolean }).draft) continue
    const [locale] = entry.id.split('/')
    if (!(languageKeys as string[]).includes(locale)) continue
    const tags = (entry.data as { tags?: string[] }).tags ?? []
    for (const tag of tags) {
      if (!map[tag]) map[tag] = new Set()
      map[tag].add(locale as UILanguages)
    }
  }

  return map
}
