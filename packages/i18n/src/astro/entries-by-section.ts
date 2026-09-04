import type { SectionRoutes } from '../section'
import type { GenericCollectionEntry } from './entry-adapter'
import type { Draftable } from './filters'

/**
 * Collection entries grouped by section.
 *
 * @template TSection - Supported section identifiers.
 * @template TEntry - Collection entry type.
 */
export type EntriesBySection<
  TSection extends string,
  TEntry,
> = Record<TSection, readonly TEntry[]>

/**
 * Fetches all available entries for a locale and groups them by section.
 *
 * Collections are loaded in parallel using Promise.all().
 *
 * @template TSection - Supported section identifiers.
 * @template TLocale - Supported locales.
 * @template TEntry - Collection entry type containing draft metadata.
 *
 * @param sectionRoutes - Section routes value object.
 * @param locale - Locale to filter entries by.
 * @param fetchCollection - Collection retrieval function.
 * @returns Entries grouped by section.
 */
export async function getEntriesBySection<
  TSection extends string,
  TLocale extends string,
  TEntry extends GenericCollectionEntry<TSection, Draftable>,
>(
  sectionRoutes: SectionRoutes<TSection, TLocale>,
  getEntries: (section: TSection) => Promise<TEntry[]>,
): Promise<EntriesBySection<TSection, TEntry>> {
  const result = {} as EntriesBySection<TSection, TEntry>

  await Promise.all(
    sectionRoutes.getSections().map(async section => {
      result[section] = await getEntries(section)
    }),
  )

  return result
}
