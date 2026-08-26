import { extractCleanId } from './extract-id'
import type { Locales } from './locale'
import {
  availableLink,
  draftLink,
  missingLink,
  type TranslationLink,
} from './translationLink'

/**
 * Represents a localized standalone page.
 */
export interface StandalonePageEntry {
  /**
   * Route to the page.
   */
  route: string

  /**
   * Indicates whether the page exists only as a draft.
   */
  draft?: boolean
}

/**
* Maps a page identifier to its localized standalone page entries.
*
* The first key represents the page identifier and the nested keys represent
* locales.
*/
export type StandalonePageIndex<
  K extends string,
  L extends string,
> = Record<
  K,
  Partial<Record<L, StandalonePageEntry>>
>

/**
 * Creates translation links for a standalone page.
 *
 * Validates that:
 * - the translation key is indexed
 * - the current route belongs to the indexed translation group
 */
export function createStandalonePageLinks<
  L extends string,
>(
  url: URL,
  translationKey: string,
  index: StandalonePageIndex<string, L>,
  locales: Locales<L>,
): TranslationLink<L>[] {
  const { locale: currentLocale, id: currentRoute } = extractCleanId(
    url.pathname.slice(1).replace(/\/$/, ''),
    locales,
  )

  const group = index[translationKey]

  if (!group) {
    throw new Error(
      `Standalone page '${translationKey}' is not indexed.`,
    )
  }

  const currentEntry = group[currentLocale]

  if (!currentEntry) {
    throw new Error(
      `Standalone page '${translationKey}' has no entry for locale '${currentLocale}'.`,
    )
  }

  if (currentEntry.route !== currentRoute) {
    throw new Error(
      `Route '${url.pathname}' does not belong to standalone page '${translationKey}'.`,
    )
  }

  return locales.all.map(locale => {
    const entry = group[locale]

    if (!entry) {
      return missingLink(locale)
    }

    const href = `/${locale}/${entry.route}`

    if (entry.draft) {
      return draftLink(href, locale)
    }

    return availableLink(href, locale)
  })
}