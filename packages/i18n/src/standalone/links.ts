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
  paramPage: string,
  routes: StandalonePageRoutes<TPage, TLocale>,
  locales: Locales<TLocale>,
): TranslationLink<TLocale>[] {
  const { locale: currentLocale, cleanId: currentSlug } = locales.parseEntryId(path)
  const page = routes.getPage(paramPage)
  const pageRoutes = routes.routes[page]
  const currentEntry = pageRoutes[currentLocale]

  if (!currentEntry) {
    throw new Error(
      `Standalone page '${String(page)}' has no entry for locale '${currentLocale}'.`,
    )
  }

  if (currentEntry.slug !== currentSlug) {
    throw new Error(
      `Path '${path}' does not belong to standalone page '${String(page)}'.`,
    )
  }

  return locales.all.map(locale => {
    const entry: StandalonePageEntry | undefined = pageRoutes[locale]

    if (!entry) {
      return missingLink(locale)
    }

    const href = routes.getPagePath(page, locale)
    return entry.draft ? draftLink(href, locale) : availableLink(href, locale)
  })
}
