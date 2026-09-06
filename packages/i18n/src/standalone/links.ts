import { extractCleanId } from '../core/extract-id'
import type { Locales } from '../core/locale'
import {
  availableLink,
  draftLink,
  missingLink,
  type TranslationLink,
} from '../core/translationLink'
import type { StandalonePageEntry, StandalonePageRoutes } from './routes'

export function createStandalonePageLinks<
  TPage extends string,
  TLocale extends string,
>(
  path: string,
  page: TPage,
  routes: StandalonePageRoutes<TPage, TLocale>,
  locales: Locales<TLocale>,
): TranslationLink<TLocale>[] {
  const { locale: currentLocale, id: currentRoute } = extractCleanId(
    path,
    locales,
  )

  const pageRoutes = routes.routes[page]

  if (!pageRoutes) {
    throw new Error(
      `Standalone page '${String(page)}' is not indexed.`,
    )
  }

  const currentEntry = pageRoutes[currentLocale]

  if (!currentEntry) {
    throw new Error(
      `Standalone page '${String(page)}' has no entry for locale '${currentLocale}'.`,
    )
  }

  if (currentEntry.route !== currentRoute) {
    throw new Error(
      `Route '${path}' does not belong to standalone page '${String(page)}'.`,
    )
  }

  return locales.all.map(locale => {
    const entry: StandalonePageEntry | undefined = pageRoutes[locale]

    if (!entry) {
      return missingLink(locale)
    }

    const href = routes.getPageURL(page, locale)
    return entry.draft ? draftLink(href, locale) : availableLink(href, locale)
  })
}
