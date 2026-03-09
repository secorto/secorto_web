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
 * Returns the set of locales in which a given tag exists (has at least one non-draft post).
 * Used by tag pages to build LanguagePicker links with availability info.
 *
 * @param allEntries - Pre-fetched collection entries (caller calls getCollection)
 * @param tag - Tag to check
 * @returns Set of UILanguages where the tag is present
 */
export function getLocalesWithTag(
  allEntries: CollectionEntry<CollectionKey>[],
  tag: string
): Set<UILanguages> {
  const result = new Set<UILanguages>()

  for (const lang of languageKeys) {
    const hasTag = allEntries.some(
      (e) =>
        e.id.startsWith(`${lang}/`) &&
        !(e.data as { draft?: boolean }).draft &&
        (e.data as { tags?: string[] }).tags?.includes(tag)
    )
    if (hasTag) result.add(lang)
  }

  return result
}
