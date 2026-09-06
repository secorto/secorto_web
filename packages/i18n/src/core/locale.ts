/**
 * Immutable value object describing a supported locale set and the operations
 * used to validate and normalize locale identifiers.
 *
 * @template TLocale - Supported locale codes, such as 'en' or 'es'.
 */
export interface LocalePathResolver<TLocale extends string> {
  /**
   * Builds the locale-prefixed path for a supported locale.
   *
   * @param locale Locale identifier to resolve.
   * @returns The path rooted at the locale, such as `/en`.
   */
  getPath(locale: TLocale): string
}

export interface Locales<TLocale extends string> extends LocalePathResolver<TLocale> {
  /**
   * Ordered list of locales accepted by this value object.
   */
  readonly all: readonly TLocale[]

  /**
   * Returns the canonical locale value when the input is supported.
   *
   * @param lang Locale identifier to validate.
   * @returns The normalized locale value.
   * @throws {TypeError} When the locale is missing or not in the configured set.
   */
  fromString(lang: string | undefined): TLocale

  /**
   * Checks whether a locale is included in the configured set.
   *
   * @param lang Locale identifier to test.
   * @returns `true` when the locale is supported.
   */
  isValid(lang: string): lang is TLocale
}

function isLocale<TLocale extends string>(
  locales: readonly TLocale[],
  lang: string
): lang is TLocale {
  return locales.includes(lang as TLocale)
}

export function createLocales<TLocale extends string>(
  locales: readonly TLocale[]
): Locales<TLocale> {
  const stableLocales = Object.freeze([...locales]) as readonly TLocale[]

  const fromString = (lang: string | undefined): TLocale => {
    if (!lang) throw new TypeError(`Invalid language: ${lang}`)
    if (isLocale(stableLocales, lang)) return lang
    throw new TypeError(`Invalid language: ${lang}`)
  }

  const isValid = (lang: string): lang is TLocale => isLocale(stableLocales, lang)

  const getPath = (locale: string): string => `/${fromString(locale)}`

  return Object.freeze({
    all: stableLocales,
    fromString,
    isValid,
    getPath,
  })
}
