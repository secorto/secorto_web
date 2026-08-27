import { Locales } from '../core'
import {
  createTranslationIndex,
  LocalizedEntry,
  TranslationIndex,
} from './translation-index'
import {
  adaptToLocalizedEntry,
  GenericCollectionEntry,
} from './entry-adapter'
import { SectionRoutes } from './routes'

export type DetailPath<
  TEntry extends GenericCollectionEntry<C, object>,
  C extends string,
  L extends string,
> = {
  params: {
    locale: L
    section: string
    id: string
  }
  props: {
    entry: LocalizedEntry<TEntry, L>
    section: C
    siblings: TranslationIndex<L, TEntry>[string]
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
 * @template TEntry Entry type returned by the collection loader.
 * @template E Entry data type.
 * @template C Section identifiers (for example: `'blog' | 'docs'`).
 * @template L Locale identifiers (for example: `'en' | 'es'`).
 *
 * @param routes Localized section routes used to resolve URL segments.
 * @param fetchCollection Function that retrieves all entries belonging
 * to a given section.
 * @param allowedLocales Supported locales
 */
export async function getStaticPathsEntries<
  TEntry extends GenericCollectionEntry<C, E>,
  E extends object,
  C extends string,
  L extends string,
>(
  
  routes: SectionRoutes<C, L>,
  fetchCollection: (
    collection: C,
  ) => Promise<TEntry[]>,
  allowedLocales: Locales<L>,
): Promise<DetailPath<TEntry, C, L>[]> {

  const allPaths: DetailPath<TEntry, C, L>[] = []

  for (const sectionKey in routes.routes) {
    const rawEntries = await fetchCollection(sectionKey)

    const localizedEntries = rawEntries.map(entry =>
      adaptToLocalizedEntry<TEntry, E, C, L>(
        entry,
        allowedLocales,
      ),
    )

    const index = createTranslationIndex(localizedEntries)

    for (const localized of localizedEntries) {
      allPaths.push({
        params: {
          locale: localized.locale,
          section: routes.getSectionRoute(sectionKey, localized.locale),
          id: localized.cleanId,
        },
        props: {
          entry: localized,
          section: sectionKey,
          siblings: index[localized.translationKey],
        },
      })
    }
  }

  return allPaths
}