import { availableLink, draftLink, missingLink } from '../core'
import type { Locales, TranslationLink } from '../core'
import type { SectionRoutes } from './routes'
import type { LocalizedEntry } from './translation-index'

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
  TSection extends string,
  TLocale extends string,
  TEntry,
>(
  siblings: Partial<Record<TLocale, LocalizedEntry<TSection, TEntry, TLocale>>>,
  sectionRoutes: SectionRoutes<TSection, TLocale>,
  locales: Locales<TLocale>,
): TranslationLink<TLocale>[] {
  return locales.all.map(locale => {
    const sibling = siblings[locale]

    if (!sibling) {
      return missingLink(locale)
    }

    const href = sectionRoutes.getEntryURL(
      sibling.section,
      locale,
      sibling.cleanId,
    )

    return sibling.draft ? draftLink(href, locale) : availableLink(href, locale)
  })
}
