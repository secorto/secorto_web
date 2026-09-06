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
  return {
    all: locales,

    fromString(lang) {
      if (!lang) throw new TypeError(`Invalid language: ${lang}`)
      if (isLocale(locales, lang)) return lang
      throw new TypeError(`Invalid language: ${lang}`)
    },

    isValid(lang): lang is TLocale {
      return isLocale(locales, lang)
    },

    getPath(locale) {
      const normalized = this.fromString(locale)
      return `/${normalized}`
    }
  }
}
