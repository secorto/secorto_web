import type { Locales } from '../core'

export interface LocalePaths<TLocale extends string> {
  params: {
    locale: TLocale
  }
}

/**
 * Generates the static path definitions required to build localized root pages.
 *
 * This function iterates through all supported locales and maps each one to a
 * routing parameter object, enabling the creation of root localized landing pages
 * (for example: `/en` or `/es`).
 *
 * @template TLocale Locale identifiers (for example: `'en' | 'es'`).
 *
 * @param locales Supported locales configurations.
 * @returns An array of locale path definitions containing the routing parameters.
 */
export function getStaticPathsLocales<TLocale extends string>(
  locales: Locales<TLocale>,
): LocalePaths<TLocale>[] {
  return locales.all.map(locale => ({
    params: { locale }
  }))
}
