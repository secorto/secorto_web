import type { SectionRoutes } from '../section'

/**
 * Number of matching items for a tag within a section.
 *
 * @template TSection - Supported section identifiers.
 */
export interface SectionTagCount<TSection extends string> {
  section: TSection
  count: number
}

/**
 * Returns the sections containing the specified tag together with the number
 * of matching items in each section.
 *
 * The matching logic is delegated to the caller through the `hasTag`
 * predicate, allowing this function to remain independent of Astro and any
 * specific content model.
 *
 * @template TTag - Supported tag identifiers.
 * @template TSection - Supported section identifiers.
 * @template TLocale - Supported locale identifiers.
 * @template TItem - Item type stored in each section.
 *
 * @param sectionRoutes - Section routes value object.
 * @param itemsBySection - Items grouped by section.
 * @param tag - Tag to evaluate.
 * @param hasTag - Predicate that determines whether an item belongs to a tag.
 *
 * @returns Sections containing the tag and their corresponding counts.
 */
export function getSectionsWithTagContent<
  TTag extends string,
  TSection extends string,
  TLocale extends string,
  TItem,
>(
  sectionRoutes: SectionRoutes<TSection, TLocale>,
  itemsBySection: Record<TSection, readonly TItem[]>,
  tag: TTag,
  hasTag: (item: TItem, tag: TTag) => boolean,
): SectionTagCount<TSection>[] {
  return sectionRoutes
    .getSections()
    .map(section => ({
      section,
      count: itemsBySection[section].filter(item =>
        hasTag(item, tag),
      ).length,
    }))
    .filter(({ count }) => count > 0)
}
