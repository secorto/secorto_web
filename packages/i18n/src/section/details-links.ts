import { availableLink, Locales, missingLink, TranslationLink } from "../core"
import { GenericCollectionEntry } from "./entry-adapter"
import { SectionRoutes } from "./routes"
import { LocalizedEntry } from "./translation-index"

/**
 * Creates translation links for all supported locales.
 *
 * Existing translations are returned as `available` links. Missing
 * translations are represented as `missing` links. The output preserves
 * the order defined by `locales.all`.
 *
 * @param siblings Available translations indexed by locale.
 * @param sectionRoutes Routes used to build localized URLs.
 * @param locales Supported locales.
 * @returns One translation link per supported locale.
 */
export function createDetailTranslationLinks<
  TEntry extends GenericCollectionEntry<C, object>,
  C extends string,
  L extends string,
>(
  siblings: Partial<Record<L, LocalizedEntry<TEntry, L>>>,
  sectionRoutes: SectionRoutes<C, L>,
  locales: Locales<L>,
): TranslationLink<L>[] {
  return locales.all.map(locale => {
    const sibling = siblings[locale]

    if (!sibling) {
      return missingLink(locale)
    }

    const href = sectionRoutes.getEntryURL(
      sibling.original.collection,
      locale,
      sibling.cleanId,
    )

    return availableLink(href, locale)
  })
}
