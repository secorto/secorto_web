import { SectionDictionary, Brand } from './dictionary'

/**
 * Localized route slugs per section.
 */
export type SectionRoutes<
  Section extends string,
  Language extends string
> = Brand<'SectionRoutes', SectionDictionary<Section, Language, string >>

/**
 * Constructs a nominal SectionRoutes value from a raw SectionDictionary.
 * 
 * This function enforces the domain invariants for localized section routes:
 * - each (locale, slug) pair must be unique across all sections
 * - the resulting value is branded as 'SectionRoutes'
 *
 * If any invariant is violated, an error is thrown and the SectionRoutes value
 * is not constructed.
 *
 * @template Section - The section keys (e.g., 'blog', 'docs').
 * @template Language - The language codes (e.g., 'es', 'en').
 * @param routes Raw dictionary of localized slugs per section.
 * @returns A branded SectionRoutes value.
 */
export function sectionRoutes<
  Section extends string,
  Language extends string
>(routes: SectionDictionary<Section, Language, string >): SectionRoutes<Section, Language> {
  const seen = new Map<string, Section>() // key = `${locale}:${slug}`

  for (const section in routes) {
    const localized = routes[section]

    for (const locale in localized) {
      const slug = localized[locale]
      const key = `${locale}:${slug}`

      if (seen.has(key)) {
        const other = seen.get(key)!
        throw new Error(
          `Duplicated route for locale "${locale}" and slug "${slug}" between sections "${other}" and "${section}".`
        )
      }

      seen.set(key, section)
    }
  }
  return {...routes, __brand: 'SectionRoutes'}
}

/**
 * Returns the localized slug for a section.
 */
export function getSectionRoute<Section extends string,
  Language extends string
>(
  routes: SectionRoutes<Section, Language>,
  section: Section,
  locale: Language
): string {
  return routes[section][locale]
}

/**
 * Returns the localized URL for a section.
 */
export function getSectionURL<
  Section extends string,
  Language extends string
>(
  routes: SectionRoutes<Section, Language>,
  section: Section,
  locale: Language
): string {
  return `/${locale}/${getSectionRoute(routes, section, locale)}`
}

/**
 * Returns the localized URL for a content entry
 */
export function getEntryURL<
  Section extends string,
  Language extends string
>(
  routes: SectionRoutes<Section, Language>,
  section: Section,
  locale: Language,
  slug: string
): string {
  return `${getSectionURL(routes, section, locale)}/${slug}`
}
