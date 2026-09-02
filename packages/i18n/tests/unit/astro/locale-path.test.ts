import { describe, expect, it } from 'vitest'
import { createLocales, getStaticPathsLocales } from '@secorto/i18n'

describe('getStaticPathsLocales', () => {
  it('should map an array of locales to the correct static paths format', () => {
    const locales = createLocales(['es', 'en', 'fr'] as const)

    const result = getStaticPathsLocales(locales)

    expect(result).toEqual([
      { params: { locale: 'es' } },
      { params: { locale: 'en' } },
      { params: { locale: 'fr' } },
    ])
  })
})
