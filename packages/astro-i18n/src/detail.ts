import { buildTranslationIndex, getSectionRoute, LocalizedEntry, SectionRoutes, type TranslationIndex } from '@secorto/i18n-core'
import { adaptToLocalizedEntry, GenericCollectionEntry } from './adapter'

type DetailPath<T, C extends string, L extends string> = {
    params: {
        locale: L
        section: string
        id: string
    }
    props: {
        entry: LocalizedEntry<T, C, L>
        siblings: TranslationIndex<L, T, C>[string]
    }
}

export async function getStaticPathsEntries<
  E extends object,
  C extends string,
  L extends string,
>(
  routes: SectionRoutes<C, L>,
  fetchCollection: (collection: C) => Promise<GenericCollectionEntry<C, E>[]>,
  allowedLocales: readonly L[]
): Promise<DetailPath<E, C, L>[]> {

  const allPaths: DetailPath<E, C, L>[] = []

  for (const sectionKey of Object.keys(routes) as C[]) {
    if (sectionKey === '__brand') continue

    const rawEntries = await fetchCollection(sectionKey)

    const entries: LocalizedEntry<E, C, L>[] = rawEntries.map(entry =>
      adaptToLocalizedEntry<E, C, L>(entry, allowedLocales)
    )

    const index = buildTranslationIndex(entries)

    for (const entry of entries) {
      allPaths.push({
        params: {
          locale: entry.locale,
          section: getSectionRoute(routes, sectionKey, entry.locale),
          id: entry.cleanId
        },
        props: {
          entry,
          siblings: index[entry.translationKey]
        }
      })
    }
  }

  return allPaths
}
