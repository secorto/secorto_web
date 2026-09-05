import { ensureNoRouteCollisions } from '../core'

/**
 * Immutable value object that manages localized tag routes and generates
 * section-aware tag URLs.
 *
 * URL format:
 * - /{locale}/{section}/{tagsIndex}/{tag}
 *
 * Examples:
 * - /en/blog/tags/tools
 * - /es/blog/etiquetas/herramientas
 *
 * @template TTag - The union type representing available tags.
 * @template TSection - The union type representing available sections.
 * @template TLocale - The union type representing supported locales.
 */
export type TagRoutes<
  TTag extends string,
  TSection extends string,
  TLocale extends string,
> = {
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
   * @returns The localized tag route slug.
   */
  getTagRoute: (tag: TTag, locale: TLocale) => string

  /**
   * Returns the URL for a tag within a section.
   *
   * Examples:
   * - /en/blog/tags/tools
   * - /es/blog/etiquetas/herramientas
   *
   * @param section - The section containing the tag.
   * @param locale - The locale to use.
   * @param tag - The tag whose URL should be generated.
   * @returns The localized section tag URL.
   */
  getSectionTagURL: (
    section: TSection,
    locale: TLocale,
    tag: TTag,
  ) => string

  /**
   * Returns the localized route segment used for the tag index page.
   *
   * Examples:
   * - en → "tags"
   * - es → "etiquetas"
   *
   * @param locale - The locale whose tag index route should be resolved.
   * @returns The localized tag index route segment.
   */
  getTagIndexRoute: (locale: TLocale) => string
}

/**
 * Minimal contract required from a section routes value object.
 *
 * @template TSection - The union type representing available sections.
 * @template TLocale - The union type representing supported locales.
 */
export type SectionRouteResolver<
  TSection extends string,
  TLocale extends string,
> = {
  getSectionURL: (section: TSection, locale: TLocale) => string
}

/**
 * Creates an immutable TagRoutes value object.
 *
 * The resulting object:
 * - Validates that no localized route collisions exist.
 * - Freezes all route definitions to enforce immutability.
 * - Exposes helper methods for resolving localized tag routes.
 * - Generates section-aware tag URLs by composing SectionRoutes.
 *
 * @template TTag - The union type representing available tags.
 * @template TSection - The union type representing available sections.
 * @template TLocale - The union type representing supported locales.
 *
 * @param sectionRoutes - Reference to the section route definitions.
 * @param tagIndexRoutes - Localized route segment for the tags index.
 * @param routes - A map of tags and their localized route slugs.
 *
 * @returns An immutable TagRoutes value object.
 *
 * @throws {Error} If duplicate `(locale, slug)` combinations are found across tags.
 */
export function createTagRoutes<
  TTag extends string,
  TSection extends string,
  TLocale extends string,
>(
  sectionRoutes: SectionRouteResolver<TSection, TLocale>,
  tagIndexRoutes: Record<TLocale, string>,
  routes: Record<TTag, Record<TLocale, string>>,
): TagRoutes<TTag, TSection, TLocale> {
  ensureNoRouteCollisions(routes, 'TagRoutes')
  const tags = Object.freeze(Object.keys(routes) as TTag[])

  for (const tag of tags) {
    Object.freeze(routes[tag])
  }
  Object.freeze(routes)
  Object.freeze(tagIndexRoutes)

  const getTags = (): readonly TTag[] => tags

  const getTagRoute = (
    tag: TTag,
    locale: TLocale,
  ): string => routes[tag][locale]

  const getTagIndexRoute = (locale: TLocale) => tagIndexRoutes[locale]

  const getSectionTagURL = (
    section: TSection,
    locale: TLocale,
    tag: TTag,
  ): string =>
    `${sectionRoutes.getSectionURL(section, locale)}/${
      tagIndexRoutes[locale]
    }/${getTagRoute(tag, locale)}`

  return {
    routes,
    getTags,
    getTagRoute,
    getSectionTagURL,
    getTagIndexRoute
  }
}
