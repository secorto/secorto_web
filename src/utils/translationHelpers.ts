/**
 * Translation utilities for determining locale availability
 */
import { getCollection } from 'astro:content'
import type { CollectionKey } from 'astro:content'
import type { UILanguages } from '@i18n/ui'
import { languageKeys } from '@i18n/ui'
import { extractCleanId } from './ids'

/**
 * Get list of locales where a specific content entry is available
 * 
 * @param collection - Content collection to search in
 * @param cleanId - Entry slug/ID without locale prefix
 * @returns Array of locale codes where the entry exists
 * 
 * @example
 * ```ts
 * const locales = await getAvailableLocalesForEntry('blog', '2025-01-22-my-post')
 * // Returns: ['es', 'en']
 * ```
 */
export async function getAvailableLocalesForEntry(
  collection: CollectionKey,
  cleanId: string
): Promise<UILanguages[]> {
  const allEntries = await getCollection(collection)
  
  return languageKeys.filter((lk) =>
    allEntries.some((e) => {
      const eCleanId = extractCleanId(e.id)
      return e.id.startsWith(`${lk}/`) && eCleanId === cleanId
    })
  )
}
