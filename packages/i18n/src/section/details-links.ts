import { availableLink, draftLink, missingLink } from "../core"
import type { Locales, TranslationLink } from "../core"
import type { GenericCollectionEntry } from "./entry-adapter"
import type { SectionRoutes } from "./routes"
import type { LocalizedEntry } from "./translation-index"

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
  C extends string,
  L extends string,
  TEntry extends GenericCollectionEntry<C, object>,
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

    return sibling.draft ? draftLink(href, locale) : availableLink(href, locale)
  })
}
