import type { Locales } from '../core/locale'

export interface LocalePaths<L extends string> {
  params: {
    locale: L
  }
}

export function getStaticPathsLocales<L extends string>(
  locales: Locales<L>,
): LocalePaths<L>[] {
  return locales.all.map(locale => ({
    params: { locale }
  }))
}
