export interface LocalePathResolver<TLocale extends string> {
  /**
   * Builds the locale-prefixed path for a supported locale.
   *
   * @param locale Locale identifier to resolve.
   * @returns The path rooted at the locale, such as `/en`.
   */
  getPath(locale: TLocale): string
}

export interface EntryIdResolver<TLocale extends string> {
  /**
   * Extracts the locale and cleanId from an entryId of the form "es/my-post".
   * Locale validation is delegated to the Locales value object.
   *
   * @param entryId Raw entry identifier (e.g., "es/my-post").
   * @returns An object containing the validated locale and cleanId.
   * @throws {Error} If the entryId is empty, malformed, or the locale is invalid.
   */
  parseEntryId(entryId: string): { locale: TLocale; cleanId: string }
}

/**
 * Immutable value object describing a supported locale set and the operations
 * used to validate and normalize locale identifiers.
 *
 * @template TLocale - Supported locale codes, such as 'en' or 'es'.
 */
export interface Locales<TLocale extends string> extends LocalePathResolver<TLocale>, EntryIdResolver<TLocale> {
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

  const parseEntryId = (entryId: string) => {
    if (!entryId) {
      throw new Error('entryId cannot be empty')
    }

    const firstSlash = entryId.indexOf('/')
    if (firstSlash <= 0) {
      throw new Error(`Invalid entryId "${entryId}" — missing locale prefix`)
    }

    const rawLocale = entryId.slice(0, firstSlash)

    if (!isValid(rawLocale)) {
      throw new Error(
        `Invalid entryId "${entryId}". Unknown locale prefix "${rawLocale}". Expected one of: ${stableLocales.join(', ')}.`
      )
    }

    const cleanId = entryId.slice(firstSlash + 1)

    if (!cleanId || cleanId.startsWith('/')) {
      throw new Error(`Invalid entryId "${entryId}" — missing locale prefix`)
    }

    return {
      locale: rawLocale,
      cleanId
    }
  }

  return Object.freeze({
    all: stableLocales,
    fromString,
    isValid,
    getPath,
    parseEntryId
  })
}
