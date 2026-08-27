import { Locales } from "../core"
import { adaptToLocalizedEntry, GenericCollectionEntry } from "./entry-adapter"
import { createTranslationIndex, LocalizedEntry, TranslationIndex } from "./translation-index"

type DetailPath<T, C extends string, L extends string> = {
    params: {
        locale: L
        section: C
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
  routes: Record<C, Record<L, string>>,
  fetchCollection: (collection: C) => Promise<GenericCollectionEntry<C, E>[]>,
  allowedLocales: Locales<L>
): Promise<DetailPath<E, C, L>[]> {

  const allPaths: DetailPath<E, C, L>[] = []

  for (const sectionKey in routes) {
    const rawEntries = await fetchCollection(sectionKey as C)

    const entries: LocalizedEntry<E, C, L>[] = rawEntries.map(entry =>
      adaptToLocalizedEntry<E, C, L>(entry, allowedLocales)
    )

    const index = createTranslationIndex(entries)

    for (const entry of entries) {
      allPaths.push({
        params: {
          locale: entry.locale,
          section: sectionKey,
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
