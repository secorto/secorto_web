import { ensureNoSlugCollisions } from '../core'
import type { EntryIdResolver, LocalePathResolver } from '../core'

export type SectionDictionary<
  TSection extends string,
  TLocale extends string,
  TValue
> = Record<
  TSection,
  Record<TLocale, TValue>
>

/**
 * Value object that encapsulates localized slugs per section and exposes
 * a stable API for building localized paths.
 *
 * Invariants:
 * - Each localized section slug must be unique within a locale.
 * - The object is constructed exclusively through `createSectionRoutes`.
 *
 * @template TSection - Section keys (e.g., 'blog', 'talk').
 * @template TLocale - Locale keys (e.g., 'es', 'en').
 */
export interface SectionRoutes<
  TSection extends string,
  TLocale extends string
> {
  /**
   * Raw dictionary of localized slugs per section.
   * This structure is immutable once the value object is created.
   */
  readonly routes: Record<TSection, Record<TLocale, string>>

  /**
   * Returns the configured section identifiers.
   */
  getSections(): readonly TSection[]

  /**
   * Returns the localized slug for a section.
   *
   * @param section Section identifier.
   * @param locale Locale identifier.
   * @returns Localized slug for the section.
   */
  getSectionSlug(section: TSection, locale: TLocale): string

  /**
   * Returns the localized path for a section, including locale prefix.
   *
   * @param section Section identifier.
   * @param locale Locale identifier.
   * @returns Path for the section in the given locale.
   */
  getSectionPath(section: TSection, locale: TLocale): string

  /**
   * Returns the localized path for a content entry inside a section.
   *
   * @param section Section identifier.
   * @param locale Locale identifier.
   * @param cleanId Entry clean id.
   * @returns Full path for the entry.
   */
  getEntryPath(section: TSection, locale: TLocale, cleanId: string): string

  /**
   * Returns the localized path for a content entry from its localized entry identifier.
   *
   * @param section Section identifier.
   * @param locale Locale identifier.
   * @param entryId Entry identifier with locale prefix.
   * @returns Full path for the entry.
   */
  getEntryPathFromId(section: TSection, locale: TLocale, entryId: string): string
}

/**
 * Constructs a nominal SectionRoutes value from a raw SectionDictionary.
 *
 * This function enforces the domain invariants for localized section routes:
 * - each localized section slug must be unique within a locale
 * - the resulting value is branded as 'SectionRoutes'
 *
 * If any invariant is violated, an error is thrown and the SectionRoutes value
 * is not constructed.
 *
 * @template TSection - The section keys (e.g., 'blog', 'docs').
 * @template TLocale - The language codes (e.g., 'es', 'en').
 * @param routes Raw dictionary of localized slugs per section.
 * @returns A branded SectionRoutes value.
 */
export function createSectionRoutes<
  TSection extends string,
  TLocale extends string
>(
  routes: SectionDictionary<TSection, TLocale, string>,
  locales: LocalePathResolver<TLocale> & EntryIdResolver<TLocale>
): SectionRoutes<TSection, TLocale> {
  ensureNoSlugCollisions(routes, 'SectionRoutes')
  const sections = Object.freeze(Object.keys(routes) as TSection[])

  // Enforce runtime immutability for the value object invariants.
  for (const section of sections) {
    Object.freeze(routes[section])
  }
  Object.freeze(routes)

  const getSections = (): readonly TSection[] => sections

  const getSectionSlug = (section: TSection, locale: TLocale): string =>
    routes[section][locale]

  const getSectionPath = (section: TSection, locale: TLocale): string =>
    `${locales.getPath(locale)}/${getSectionSlug(section, locale)}`

  const getEntryPath = (
    section: TSection,
    locale: TLocale,
    cleanId: string
  ): string =>
    `${getSectionPath(section, locale)}/${cleanId}`

  const getEntryPathFromId = (section: TSection, locale: TLocale, entryId: string): string => {
    const parsed = locales.parseEntryId(entryId)

    if (parsed.locale !== locale) {
      throw new Error(
        `Locale mismatch: entry "${entryId}" belongs to locale "${parsed.locale}" but locale "${locale}" was requested.`
      )
    }
    return getEntryPath(section, locale, parsed.cleanId)
  }

  return {
    routes,
    getSections,
    getSectionSlug,
    getSectionPath,
    getEntryPath,
    getEntryPathFromId,
  }
}
