import type { LocalePathResolver } from '../core/locale'

export interface StandalonePageEntry {
  slug: string
  draft?: boolean
}

export interface StandalonePageRoutes<
  TPage extends string,
  TLocale extends string,
> {
  /**
   * Immutable map of standalone pages keyed by their canonical page name.
   * Each page contains a locale-indexed route entry for every supported locale.
   */
  readonly routes: Record<TPage, Partial<Record<TLocale, StandalonePageEntry>>>

  /**
   * Lists the canonical standalone page keys registered in this value object.
   */
  getPages(): readonly TPage[]

  /**
   * Resolves a raw page key string to its canonical registered value.
   *
   * This validation is part of the value object contract: if the input is not
   * one of the indexed standalone pages, the method throws instead of silently
   * accepting an unknown key.
   *
   * @param key Raw key provided by callers or route metadata.
   * @returns The canonical page key stored in this routes definition.
   * @throws {Error} When the key is not registered in the page index.
   */
  getPage(key: string): TPage

  /**
   * Returns the localized slug for the given page and locale.
   *
   * @param page Canonical standalone page key.
   * @param locale Locale whose slug should be resolved.
   * @returns The localized slug without the locale prefix.
   * @throws {Error} When the page or locale combination is not registered.
   */
  getPageSlug(page: TPage, locale: TLocale): string

  /**
   * Builds the path for a standalone page in the given locale.
   *
   * @param page Canonical standalone page key.
   * @param locale Locale used to build the path.
   * @returns The locale-prefixed path for the page.
   * @throws {Error} When the page or locale combination is not registered.
   */
  getPagePath(page: TPage, locale: TLocale): string
}

function ensureNoStandaloneSlugCollisions<
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

      const key = `${locale}:${entry.slug}`
      const other = seen.get(key)

      if (other) {
        throw new Error(
          `Slug collision detected in ${contextName}: The slug "${entry.slug}" for locale "${locale}" is duplicated between "${other}" and "${page}".`,
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
  ensureNoStandaloneSlugCollisions(routes, 'StandalonePageRoutes')

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

  const getPage = (key: string): TPage => {
    const page = pages.find(page => page === key)

    if (!page) {
      throw new Error(`Standalone page '${key}' is not indexed.`)
    }

    return page
  }

  const getPageSlug = (page: TPage, locale: TLocale): string => {
    const entry = routes[page]?.[locale]
    if (!entry) {
      throw new Error(
        `Standalone page '${String(page)}' has no entry for locale '${String(locale)}'.`,
      )
    }
    return entry.slug
  }

  const getPagePath = (page: TPage, locale: TLocale): string =>
    `${locales.getPath(locale)}/${getPageSlug(page, locale)}`

  return {
    routes,
    getPages,
    getPage,
    getPageSlug,
    getPagePath,
  }
}
