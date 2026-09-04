import { Locales } from "../core"
import { SectionRoutes } from "../section"
import { TagRoutes } from "../tags"

export type StaticPathSectionTag<
  TTag extends string,
  TSection extends string,
  TLocale extends string,
> = {
  params: {
    locale: TLocale
    section: string
    tagIndex: string
    tag: string
  }
  props: {
    section: TSection
    tag: TTag
  }
}

/**
 * Generates static paths for all localized combinations of sections and tags.
 *
 * For every section, locale, and tag, a path definition is created with the
 * corresponding route parameters and page props.
 *
 * Generated URL format:
 * - /{locale}/{section}/{tagIndex}/{tag}
 *
 * Examples:
 * - /en/blog/tags/tools
 * - /es/blog/etiquetas/herramientas
 *
 * @template TTag - Supported tag identifiers.
 * @template TSection - Supported section identifiers.
 * @template TLocale - Supported locale identifiers.
 *
 * @param locales - Available locales.
 * @param sectionRoutes - Section route definitions.
 * @param tagRoutes - Tag route definitions.
 *
 * @returns An array of static path definitions for all section-tag
 * combinations.
 */
export function getStaticPathsSectionTags<
  TTag extends string,
  TSection extends string,
  TLocale extends string,
>(
  locales: Locales<TLocale>,
  sectionRoutes: SectionRoutes<TSection, TLocale>,
  tagRoutes: TagRoutes<TTag, TSection, TLocale>,
): StaticPathSectionTag<TTag, TSection, TLocale>[] {
  const paths = []

  for (const section of sectionRoutes.getSections()) {
    for (const locale of locales.all) {
      for (const tag of tagRoutes.getTags()) {
        paths.push({
          params: {
            locale,
            section: sectionRoutes.getSectionRoute(
              section,
              locale,
            ),
            tagIndex: tagRoutes.getTagIndexRoute(locale),
            tag: tagRoutes.getTagRoute(
              tag,
              locale,
            ),
          },
          props: {
            section,
            tag
          }
        })
      }
    }
  }

  return paths
}
