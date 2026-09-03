import type { Locales } from '../core'
import {
  createTranslationIndex,
} from '../section/translation-index'
import type {
  LocalizedEntry,
  TranslationIndex,
} from '../section/translation-index'
import {
  adaptToLocalizedEntry,
} from './entry-adapter'
import type { GenericCollectionEntry } from './entry-adapter'
import type { SectionRoutes } from '../section/routes'

export type DetailPath<
  TSection extends string,
  TLocale extends string,
  TEntry extends GenericCollectionEntry<TSection, object>,
> = {
  params: {
    locale: TLocale
    section: string
    id: string
  }
  props: {
    entry: LocalizedEntry<TSection, TEntry, TLocale>
    section: TSection
    siblings: NonNullable<TranslationIndex<TSection, TLocale, TEntry>[string]>
  }
}

/**
 * Generates the static path definitions required to build localized detail pages
 * for all entries across all configured sections.
 *
 * For each section defined in `routes`, this function:
 * 1. Fetches the collection entries.
 * 2. Adapts them into localized entries.
 * 3. Groups translations by translation key.
 * 4. Produces one path per localized entry, including its translation siblings.
 *
 * The resulting paths can be consumed by static site generators to create
 * localized detail pages with access to the current entry and all of its
 * translations.
 *
 * @template TSection Section identifiers (for example: `'blog' | 'docs'`).
 * @template TData The raw data schema type inside the entry (e.g., frontmatter shape).
 * @template TLocale Locale identifiers (for example: `'en' | 'es'`).
 * @template TEntry The full collection entry object shape containing both id and data.
 *
 * @param routes Localized section routes used to resolve URL segments.
 * @param fetchCollection Function that retrieves all entries belonging to a given section.
 * @param allowedLocales Supported locales configurations.
 */
export async function getStaticPathsEntries<
  TSection extends string,
  TData extends object,
  TLocale extends string,
  TEntry extends GenericCollectionEntry<TSection, TData>,
>(
  routes: SectionRoutes<TSection, TLocale>,
  fetchCollection: (
    collection: TSection,
  ) => Promise<TEntry[]>,
  allowedLocales: Locales<TLocale>,
): Promise<DetailPath<TSection, TLocale, TEntry>[]> {

  const allPaths: DetailPath<TSection, TLocale, TEntry>[] = []

  for (const sectionKey of routes.getSections()) {
    const rawEntries = await fetchCollection(sectionKey)

    const localizedEntries = rawEntries.map(entry =>
      adaptToLocalizedEntry<TSection, TData, TLocale, TEntry>(entry, allowedLocales),
    )

    const index = createTranslationIndex(localizedEntries)

    for (const localized of localizedEntries) {
      const siblings = index[localized.translationKey]

      if (!siblings || Object.keys(siblings).length === 0) {
        throw new Error(
          `Missing translation group for key "${localized.translationKey}"`,
        )
      }

      allPaths.push({
        params: {
          locale: localized.locale,
          section: routes.getSectionRoute(sectionKey, localized.locale),
          id: localized.cleanId,
        },
        props: {
          entry: localized,
          section: sectionKey,
          siblings,
        },
      })
    }
  }

  return allPaths
}
