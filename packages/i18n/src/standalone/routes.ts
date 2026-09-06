import type { LocalePathResolver } from '../core/locale'

export interface StandalonePageEntry {
  route: string
  draft?: boolean
}

export interface StandalonePageRoutes<
  TPage extends string,
  TLocale extends string,
> {
  readonly routes: Record<TPage, Partial<Record<TLocale, StandalonePageEntry>>>
  getPages(): readonly TPage[]
  getPageRoute(page: TPage, locale: TLocale): string
  getPageURL(page: TPage, locale: TLocale): string
}

function ensureNoStandaloneRouteCollisions<
  TPage extends string,
  TLocale extends string,
>(
  routes: Record<TPage, Partial<Record<TLocale, StandalonePageEntry>>>,
  contextName: string,
): void {
  const seen = new Map<string, TPage>()

  for (const [page, localizedRoutes] of Object.entries(routes) as [
    TPage,
    Partial<Record<TLocale, StandalonePageEntry>> | undefined,
  ][]) {
    if (!localizedRoutes || Object.keys(localizedRoutes).length === 0) {
      throw new Error(
        `Standalone page '${String(page)}' has no localized entries.`,
      )
    }

    for (const [locale, entry] of Object.entries(localizedRoutes) as [
      TLocale,
      StandalonePageEntry | undefined,
    ][]) {
      if (!entry) {
        throw new Error(
          `Standalone page '${String(page)}' has no entry for locale '${String(locale)}'.`,
        )
      }

      const key = `${locale}:${entry.route}`
      const other = seen.get(key)

      if (other) {
        throw new Error(
          `Route collision detected in ${contextName}: The slug "${entry.route}" for locale "${locale}" is duplicated between "${other}" and "${page}".`,
        )
      }

      seen.set(key, page)
    }
  }
}

export function createStandalonePageRoutes<
  TPage extends string,
  TLocale extends string,
>(
  routes: Record<TPage, Partial<Record<TLocale, StandalonePageEntry>>>,
  locales: LocalePathResolver<TLocale>,
): StandalonePageRoutes<TPage, TLocale> {
  ensureNoStandaloneRouteCollisions(routes, 'StandalonePageRoutes')

  const pages = Object.freeze(Object.keys(routes) as TPage[])

  for (const page of pages) {
    const localizedRoutes = routes[page]

    for (const locale of Object.keys(localizedRoutes) as TLocale[]) {
      const entry = localizedRoutes[locale]
      Object.freeze(entry)
    }
    Object.freeze(localizedRoutes)
  }
  Object.freeze(routes)

  const getPages = (): readonly TPage[] => pages

  const getPageRoute = (page: TPage, locale: TLocale): string => {
    const entry = routes[page]?.[locale]
    if (!entry) {
      throw new Error(
        `Standalone page '${String(page)}' has no entry for locale '${String(locale)}'.`,
      )
    }
    return entry.route
  }

  const getPageURL = (page: TPage, locale: TLocale): string =>
    `${locales.getPath(locale)}/${getPageRoute(page, locale)}`

  return {
    routes,
    getPages,
    getPageRoute,
    getPageURL,
  }
}
