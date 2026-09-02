export type SectionDictionary<
  Section extends string,
  Language extends string,
  TValue
> = Record<
  Section,
  Record<Language, TValue>
>

/**
 * Value object that encapsulates localized slugs per section and exposes
 * a stable API for building localized URLs.
 *
 * Invariants:
 * - Each (locale, slug) pair must be unique across all sections.
 * - The object is constructed exclusively through `createSectionRoutes`.
 *
 * @template Section - Section keys (e.g., 'blog', 'talk').
 * @template Language - Locale keys (e.g., 'es', 'en').
 */
export interface SectionRoutes<
  Section extends string,
  Language extends string
> {
  /**
   * Raw dictionary of localized slugs per section.
   * This structure is immutable once the value object is created.
   */
  readonly routes: Record<Section, Record<Language, string>>

  /**
   * Returns the configured section identifiers.
   */
  getSections(): readonly Section[]

  /**
   * Returns the localized slug for a section.
   *
   * @param section Section identifier.
   * @param locale Locale identifier.
   * @returns Localized slug for the section.
   */
  getSectionRoute(section: Section, locale: Language): string

  /**
   * Returns the localized URL for a section, including locale prefix.
   *
   * @param section Section identifier.
   * @param locale Locale identifier.
   * @returns URL string for the section in the given locale.
   */
  getSectionURL(section: Section, locale: Language): string

  /**
   * Returns the localized URL for a content entry inside a section.
   *
   * @param section Section identifier.
   * @param locale Locale identifier.
   * @param slug Entry slug.
   * @returns Full URL for the entry.
   */
  getEntryURL(section: Section, locale: Language, slug: string): string

  /**
   * Returns the localized URL for a tag page inside a section.
   *
   * @param section Section identifier.
   * @param locale Locale identifier.
   * @param tag Tag name.
   * @returns Full URL for the tag page.
   */
  getEntryTagURL(section: Section, locale: Language, tag: string): string
}

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
export function createSectionRoutes<
  Section extends string,
  Language extends string
>(
  routes: SectionDictionary<Section, Language, string>
): SectionRoutes<Section, Language> {
  const seen = new Map<string, Section>()
  const sections = Object.freeze(Object.keys(routes) as Section[])

  for (const section of sections) {
    const localized = routes[section]

    for (const locale of Object.keys(localized) as Language[]) {
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

  // Enforce runtime immutability for the value object invariants.
  for (const section of sections) {
    Object.freeze(routes[section])
  }
  Object.freeze(routes)

  const getSections = (): readonly Section[] => sections

  const getSectionRoute = (section: Section, locale: Language): string =>
    routes[section][locale]

  const getSectionURL = (section: Section, locale: Language): string =>
    `/${locale}/${getSectionRoute(section, locale)}`

  const getEntryTagURL = (
    section: Section,
    locale: Language,
    tag: string
  ): string =>
    `${getSectionURL(section, locale)}/tags/${encodeURIComponent(tag)}`

  const getEntryURL = (
    section: Section,
    locale: Language,
    slug: string
  ): string =>
    `${getSectionURL(section, locale)}/${slug}`

  return {
    routes,
    getSections,
    getSectionRoute,
    getSectionURL,
    getEntryURL,
    getEntryTagURL
  }
}
