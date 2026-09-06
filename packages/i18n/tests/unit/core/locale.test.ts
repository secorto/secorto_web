import { describe, expect, it } from 'vitest'
import { createLocales } from '@secorto/i18n'

describe('createLocales', () => {
  const languages = createLocales(['en', 'es', 'fr'] as const)

  it('exposes the configured locale set in the declared order', () => {
    expect(languages.all).toEqual(['en', 'es', 'fr'])
  })

  for (const locale of languages.all) {
    it('returns the same locale when it is supported by the value object', () => {
      expect(languages.fromString(locale)).toBe(locale)
    })
  }

  it('throws when the input is not one of the supported locales', () => {
    expect(() => languages.fromString('xx')).toThrow('Invalid language: xx')
  })

  it('throws when the input is missing', () => {
    expect(() => languages.fromString(undefined)).toThrow('Invalid language: undefined')
  })

  it('reports whether a locale is accepted by the value object', () => {
    expect(languages.isValid('es')).toBe(true)
    expect(languages.isValid('xx')).toBe(false)
  })

  it('builds the locale path only for supported locales', () => {
    expect(languages.getPath('en')).toBe('/en')
    expect(languages.getPath('fr')).toBe('/fr')
    // @ts-expect-error 'xx' is not a supported locale; runtime should throw
    expect(() => languages.getPath('xx')).toThrow('Invalid language: xx')
  })

  it('keeps getPath safe when extracted without binding', () => {
    const { getPath } = languages

    expect(getPath('es')).toBe('/es')
    // @ts-expect-error 'xx' is not a supported locale; runtime should throw
    expect(() => getPath('xx')).toThrow('Invalid language: xx')
  })
})

