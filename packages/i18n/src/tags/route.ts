import { ensureNoRouteCollisions } from '../core'

/**
 * Immutable value object that manages localized routes for tags.
 *
 * @template TTag - The union type representing available tags.
 * @template TLocale - The union type representing supported locales.
 */
export type TagRoutes<TTag extends string, TLocale extends string> = {
  /**
   * Map of tags to their localized route slugs.
   */
  routes: Record<TTag, Record<TLocale, string>>

  /**
   * Returns all available tags.
   *
   * @returns A readonly array containing all configured tags.
   */
  getTags: () => readonly TTag[]

  /**
   * Returns the localized route slug for the specified tag and locale.
   *
   * @param tag - The tag whose route should be resolved.
   * @param locale - The locale for which the route should be returned.
   * @returns The localized route slug.
   */
  getTagRoute: (tag: TTag, locale: TLocale) => string

  /**
   * Returns the full index URL for the specified tag and locale.
   *
   * Example:
   * - `/es/juegos`
   * - `/en/games`
   *
   * @param tag - The tag whose index URL should be generated.
   * @param locale - The locale to use when generating the URL.
   * @returns The localized index URL.
   */
  getTagIndexURL: (tag: TTag, locale: TLocale) => string
}

/**
 * Creates an immutable TagRoutes value object.
 *
 * The resulting object:
 * - Validates that no localized route collisions exist.
 * - Freezes all route definitions to enforce immutability.
 * - Exposes helper methods for resolving localized routes and URLs.
 *
 * @template TTag - The union type representing available tags.
 * @template TLocale - The union type representing supported locales.
 *
 * @param routes - A map of tags and their localized route slugs.
 * @returns An immutable TagRoutes value object.
 *
 * @throws {Error} If duplicate `(locale, slug)` combinations are found across tags.
 */
export function createTagRoutes<TTag extends string, TLocale extends string>(
  routes: Record<TTag, Record<TLocale, string>>
): TagRoutes<TTag, TLocale> {
  // Validate business invariant
  ensureNoRouteCollisions(routes, 'TagRoutes')

  // Freeze structures to guarantee immutability
  const tags = Object.freeze(Object.keys(routes) as TTag[])
  for (const tag of tags) {
    Object.freeze(routes[tag])
  }
  Object.freeze(routes)

  /**
   * Returns all configured tags.
   */
  const getTags = (): readonly TTag[] => tags

  /**
   * Resolves the localized route slug for a tag.
   *
   * @param tag - The tag to resolve.
   * @param locale - The desired locale.
   * @returns The localized route slug.
   */
  const getTagRoute = (tag: TTag, locale: TLocale): string =>
    routes[tag][locale]

  /**
   * Builds the localized index URL for a tag.
   *
   * @param tag - The tag to resolve.
   * @param locale - The desired locale.
   * @returns A localized URL in the format `/{locale}/{slug}`.
   */
  const getTagIndexURL = (tag: TTag, locale: TLocale): string =>
    `/${locale}/${getTagRoute(tag, locale)}`

  return {
    routes,
    getTags,
    getTagRoute,
    getTagIndexURL
  }
}
