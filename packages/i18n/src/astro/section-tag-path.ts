import type { Locales } from '../core'
import type { SectionRoutes } from '../section'
import type { TagRoutes } from '../tags'
import type { GenericCollectionEntry } from './entry-adapter'
import { availableAtLocale, withTag } from './filters'
import type { Draftable } from './filters'

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
    siblings: readonly TLocale[]
  }
}

/**
 * Generates static paths only for section-tag combinations that contain
 * content.
 *
 * Generated URL format:
 * - /{locale}/{section}/{tagIndex}/{tag}
 *
 * Unlike the basic cartesian-product approach, this implementation skips
 * empty tag pages and generates routes only when matching content exists.
 *
 * @template TTag Supported tag identifiers.
 * @template TSection Supported section identifiers.
 * @template TLocale Supported locale identifiers.
 * @template TEntry Collection entry type.
 *
 * @param locales Available locales.
 * @param sectionRoutes Section route definitions.
 * @param tagRoutes Tag route definitions.
 * @param getEntries Retrieves entries for a section.
 *
 * @returns Static path definitions for localized section-tag combinations
 * containing content.
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

  for (const section of sectionRoutes.getSections()) {
    const entries = await getEntries(section)

    for (const tag of tagRoutes.getTags()) {
      const entriesWithTag =
        entries.filter(withTag(tag))

      if (!entriesWithTag.length) {
        continue
      }

      const siblings =
        locales.all.filter(locale =>
          entriesWithTag.some(
            availableAtLocale(locale),
          ),
        )

      for (const locale of siblings) {
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
            siblings,
          },
        })
      }
    }
  }

  return paths
}
