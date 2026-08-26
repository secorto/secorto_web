export interface Locales<L extends string> {
  readonly all: readonly L[]
  fromString(lang: string | undefined): L
  isValid(lang: string): lang is L
}

function isLocale<L extends string>(
  locales: readonly L[],
  lang: string
): lang is L {
  return locales.includes(lang as L)
}

export function createLocales<L extends string>(
  locales: readonly L[]
): Locales<L> {
  return {
    all: locales,

    fromString(lang) {
      if (!lang) throw new TypeError(`Invalid language: ${lang}`)
      if (isLocale(locales, lang)) return lang
      throw new TypeError(`Invalid language: ${lang}`)
    },

    isValid(lang): lang is L {
      return isLocale(locales, lang)
    }
  }
}
