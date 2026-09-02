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
  L extends string,
  TEntry extends GenericCollectionEntry<TSection, object>,
> = {
  params: {
    locale: L
    section: string
    id: string
  }
  props: {
    entry: LocalizedEntry<TSection, TEntry, L>
    section: TSection
    siblings: NonNullable<TranslationIndex<TSection, L, TEntry>[string]>
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
  TSection extends string,
  E extends object,
  L extends string,
  TEntry extends GenericCollectionEntry<TSection, E>,
>(
  routes: SectionRoutes<TSection, L>,
  fetchCollection: (
    collection: TSection,
  ) => Promise<TEntry[]>,
  allowedLocales: Locales<L>,
): Promise<DetailPath<TSection, L, TEntry>[]> {

  const allPaths: DetailPath<TSection, L, TEntry>[] = []

  for (const sectionKey of routes.getSections()) {
    const rawEntries = await fetchCollection(sectionKey)

    const localizedEntries = rawEntries.map(entry =>
      adaptToLocalizedEntry<TSection, E, L, TEntry>(entry, allowedLocales),
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
