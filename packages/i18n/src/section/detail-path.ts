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
    console.log(sectionKey)
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