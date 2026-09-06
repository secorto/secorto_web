import { ensureNoRouteCollisions } from './route'
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
  TLocale extends string,
> = Record<
  K,
  Partial<Record<TLocale, StandalonePageEntry>>
>

/**
 * Value object that encapsulates localized slugs for standalone pages and
 * exposes URL builders without depending on a global rootMap.
 */
export interface StandalonePageRoutes<
  TPage extends string,
  TLocale extends string,
> {
  readonly routes: Record<TPage, Partial<Record<TLocale, StandalonePageEntry>>>

  getPages(): readonly TPage[]

  getPageRoute(page: TPage, locale: TLocale): string

  getPageURL(page: TPage, locale: TLocale): string
}

/**
 * Creates an immutable standalone page route resolver.
 */
export function createStandalonePageRoutes<
  TPage extends string,
  TLocale extends string,
>(
  index: StandalonePageIndex<TPage, TLocale>,
): StandalonePageRoutes<TPage, TLocale> {
  const pages = Object.freeze(Object.keys(index) as TPage[])

  const routeMap = Object.fromEntries(
    pages.map(page => [
      page,
      Object.fromEntries(
        Object.entries(index[page] ?? {}).map(([locale, entry]) => [locale, entry.route]),
      ) as Record<TLocale, string>,
    ]),
  ) as Record<TPage, Record<TLocale, string>>

  ensureNoRouteCollisions(routeMap, 'StandalonePageRoutes')

  for (const page of pages) {
    const pageEntries = index[page]
    if (pageEntries) {
      Object.freeze(pageEntries)
      for (const entry of Object.values(pageEntries)) {
        if (entry) {
          Object.freeze(entry)
        }
      }
    }
  }
  Object.freeze(index)

  const getPages = (): readonly TPage[] => pages

  const getPageRoute = (page: TPage, locale: TLocale): string => {
    const entry = index[page]?.[locale]
    if (!entry) {
      throw new Error(
        `Standalone page '${page}' has no entry for locale '${locale}'.`,
      )
    }
    return entry.route
  }

  const getPageURL = (page: TPage, locale: TLocale): string =>
    `/${locale}/${getPageRoute(page, locale)}`

  return {
    routes: index,
    getPages,
    getPageRoute,
    getPageURL,
  }
}

/**
 * Creates translation links for a standalone page.
 *
 * Validates that:
 * - the translation key is indexed
 * - the current route belongs to the indexed translation group
 */
export function createStandalonePageLinks<
  TLocale extends string,
>(
  path: string,
  translationKey: string,
  index: StandalonePageIndex<string, TLocale>,
  locales: Locales<TLocale>,
): TranslationLink<TLocale>[] {
  const { locale: currentLocale, id: currentRoute } = extractCleanId(
    path,
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
      `Route '${path}' does not belong to standalone page '${translationKey}'.`,
    )
  }

  return locales.all.map(locale => {
    const entry = group[locale]

    if (!entry) {
      return missingLink(locale)
    }

    const href = `/${locale}/${entry.route}`
    return entry.draft
      ? draftLink(href, locale)
      : availableLink(href, locale)
  })
}
