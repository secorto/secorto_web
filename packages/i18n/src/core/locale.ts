export interface Locales<TLocale extends string> {
  readonly all: readonly TLocale[]
  fromString(lang: string | undefined): TLocale
  isValid(lang: string): lang is TLocale
  getPath(locale: string): string
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
  const fromString = (lang: string | undefined): TLocale => {
    if (!lang) throw new TypeError(`Invalid language: ${lang}`)
    if (isLocale(locales, lang)) return lang
    throw new TypeError(`Invalid language: ${lang}`)
  }

  const isValid = (lang: string): lang is TLocale => isLocale(locales, lang)

  const getPath = (locale: string): string => `/${fromString(locale)}`

  return {
    all: locales,
    fromString,
    isValid,
    getPath,
  }
}
