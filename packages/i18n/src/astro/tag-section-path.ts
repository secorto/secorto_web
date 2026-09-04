import type { Locales } from '../core'
import type { SectionRoutes } from '../section'
import type { TagRoutes } from '../tags'
import type { GenericCollectionEntry } from './entry-adapter'
import { withTag } from './filters'
import type { Draftable } from './filters'
import { getEntriesBySection } from './entries-by-section'
import { getSectionsWithTagContent } from '../tags'

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
 * Generates static paths only for section-tag combinations that contain
 * content.
 *
 * For each locale, entries are loaded and grouped by section. Tags are then
 * evaluated against those entries and paths are generated only for sections
 * where the tag is actually present.
 *
 * Generated URL format:
 * - /{locale}/{section}/{tagIndex}/{tag}
 *
 * Examples:
 * - /en/blog/tags/tools
 * - /es/blog/etiquetas/herramientas
 *
 * Unlike the basic cartesian-product approach, this implementation skips
 * empty tag pages and generates routes only when matching content exists.
 *
 * @template TTag - Supported tag identifiers.
 * @template TSection - Supported section identifiers.
 * @template TLocale - Supported locale identifiers.
 * @template TEntry - Collection entry type.
 *
 * @param locales - Available locales.
 * @param sectionRoutes - Section route definitions.
 * @param tagRoutes - Tag route definitions.
 * @param getEntries - Function that retrieves entries for a section and locale.
 *
 * @returns Static path definitions for all localized section-tag combinations
 * that contain content.
 */
export async function getStaticPathsSectionTags<
  TTag extends string,
  TSection extends string,
  TLocale extends string,
  TEntry extends GenericCollectionEntry<
    TSection,
    Draftable & { tags?: string[] }
  >,
>(
  locales: Locales<TLocale>,
  sectionRoutes: SectionRoutes<TSection, TLocale>,
  tagRoutes: TagRoutes<TTag, TSection, TLocale>,
  getEntries: (
    section: TSection,
    locale: TLocale,
  ) => Promise<TEntry[]>,
): Promise<
  StaticPathSectionTag<
    TTag,
    TSection,
    TLocale
  >[]
> {
  const paths: StaticPathSectionTag<
    TTag,
    TSection,
    TLocale
  >[] = []

  for (const locale of locales.all) {
    const entriesBySection =
      await getEntriesBySection(
        sectionRoutes,
        section =>
          getEntries(section, locale),
      )

    for (const tag of tagRoutes.getTags()) {
      const sectionsWithTag =
        getSectionsWithTagContent(
          sectionRoutes,
          entriesBySection,
          tag,
          withTag(tag),
        )

      for (const { section } of sectionsWithTag) {
        paths.push({
          params: {
            locale,
            section:
              sectionRoutes.getSectionRoute(
                section,
                locale,
              ),
            tagIndex:
              tagRoutes.getTagIndexRoute(
                locale,
              ),
            tag: tagRoutes.getTagRoute(
              tag,
              locale,
            ),
          },
          props: {
            section,
            tag,
          },
        })
      }
    }
  }

  return paths
}
