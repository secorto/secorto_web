import { ensureNoSlugCollisions } from '../core'
import type { LocalePathResolver } from '../core/locale'

/**
 * Immutable value object that manages localized tag slugs and generates
 * section-aware tag paths.
 *
 * Path format:
 * - /{locale}/{section}/{tagsIndexSlug}/{tagSlug}
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
   * Map of tags to their localized slugs.
   */
  routes: Record<TTag, Record<TLocale, string>>

  /**
   * Returns all available tags.
   *
   * @returns A readonly array containing all configured tags.
   */
  getTags: () => readonly TTag[]

  /**
   * Returns the localized slug for the specified tag and locale.
   *
   * @param tag - The tag whose slug should be resolved.
   * @param locale - The locale for which the slug should be returned.
   * @returns The localized tag slug.
   */
  getTagSlug: (tag: TTag, locale: TLocale) => string

  /**
   * Returns the localized path for a tag within a section.
   *
   * Examples:
   * - /en/blog/tags/tools
   * - /es/blog/etiquetas/herramientas
   *
   * @param section - The section containing the tag.
   * @param locale - The locale to use.
   * @param tag - The tag whose path should be generated.
   * @returns The localized section tag path.
   */
  getSectionTagPath: (
    section: TSection,
    locale: TLocale,
    tag: TTag,
  ) => string

  /**
   * Returns the localized slug used for the tag index page.
   *
   * Examples:
   * - en → "tags"
   * - es → "etiquetas"
   *
   * @param locale - The locale whose tag index slug should be resolved.
   * @returns The localized tag index slug.
   */
  getTagIndexSlug: (locale: TLocale) => string

  /**
   * Returns the locale-prefixed path for the tag index page.
   *
   * Examples:
   * - /en/tags
   * - /es/etiquetas
   *
   * @param locale - The locale whose tag index path should be resolved.
   * @returns The localized tag index path.
   */
  getTagIndexPath: (locale: TLocale) => string
}


/**
 * Minimal contract required from a section paths value object.
 *
 * @template TSection - The union type representing available sections.
 * @template TLocale - The union type representing supported locales.
 */
export type SectionPathResolver<
  TSection extends string,
  TLocale extends string,
> = {
  getSectionPath: (
    section: TSection,
    locale: TLocale
  ) => string
}

/**
 * Creates an immutable TagRoutes value object.
 *
 * The resulting object:
 * - Validates that no localized slug collisions exist.
 * - Freezes all route definitions to enforce immutability.
 * - Exposes helper methods for resolving localized tag slugs.
 * - Generates section-aware tag paths by composing SectionRoutes.
 *
 * @template TTag - The union type representing available tags.
 * @template TSection - The union type representing available sections.
 * @template TLocale - The union type representing supported locales.
 *
 * @param sectionRoutes - Reference to the section path definitions.
 * @param tagIndexRoutes - Localized slugs for the tag index page.
 * @param routes - A map of tags and their localized slugs.
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
  sectionRoutes: SectionPathResolver<TSection, TLocale>,
  tagIndexRoutes: Record<TLocale, string>,
  routes: Record<TTag, Record<TLocale, string>>,
  locales: LocalePathResolver<TLocale>,
): TagRoutes<TTag, TSection, TLocale> {
  ensureNoSlugCollisions(routes, 'TagRoutes')
  const tags = Object.freeze(Object.keys(routes) as TTag[])

  for (const tag of tags) {
    Object.freeze(routes[tag])
  }
  Object.freeze(routes)
  Object.freeze(tagIndexRoutes)

  const getTags = (): readonly TTag[] => tags

  const getTagSlug = (
    tag: TTag,
    locale: TLocale,
  ): string => routes[tag][locale]

  const getTagIndexSlug = (locale: TLocale): string => tagIndexRoutes[locale]

  const getTagIndexPath = (locale: TLocale): string =>
    `${locales.getPath(locale)}/${getTagIndexSlug(locale)}`

  const getSectionTagPath = (
    section: TSection,
    locale: TLocale,
    tag: TTag,
  ): string =>
    `${sectionRoutes.getSectionPath(section, locale)}/${getTagIndexSlug(locale)}/${getTagSlug(tag, locale)}`

  return {
    routes,
    getTags,
    getTagSlug,
    getSectionTagPath,
    getTagIndexSlug,
    getTagIndexPath,
  }
}
