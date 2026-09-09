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

  describe('parseEntryId', () => {
    it('removes Spanish locale prefix from entry ID and returns locale', () => {
      const result = languages.parseEntryId('es/2025-01-22-my-post')
      expect(result.cleanId).toBe('2025-01-22-my-post')
      expect(result.locale).toBe('es')
    })

    it('removes English locale prefix from entry ID and returns locale', () => {
      const result = languages.parseEntryId('en/2025-01-22-my-post')
      expect(result.cleanId).toBe('2025-01-22-my-post')
      expect(result.locale).toBe('en')
    })

    it('handles entry IDs with nested paths and returns locale', () => {
      const result = languages.parseEntryId('es/blog/category/2025-01-22-my-post')
      expect(result.cleanId).toBe('blog/category/2025-01-22-my-post')
      expect(result.locale).toBe('es')
    })

    it('throws when no locale prefix exists', () => {
      expect(() => languages.parseEntryId('2025-01-22-my-post')).toThrow('Invalid entryId "2025-01-22-my-post" — missing locale prefix')
    })

    it('handles simple slug without date prefix', () => {
      const result = languages.parseEntryId('es/simple-slug')
      expect(result.cleanId).toBe('simple-slug')
      expect(result.locale).toBe('es')
    })

    it('throws when entry ID has only locale', () => {
      expect(() => languages.parseEntryId('es')).toThrow('Invalid entryId "es" — missing locale prefix')
    })

    it('handles entry ID with multiple locale-like prefixes (only removes first)', () => {
      const result = languages.parseEntryId('es/en/something')
      expect(result.cleanId).toBe('en/something')
      expect(result.locale).toBe('es')
    })

    it('throws when unknown locale prefix is present', () => {
      expect(() => languages.parseEntryId('de/2025-01-22-my-post')).toThrow('Invalid entryId "de/2025-01-22-my-post". Unknown locale prefix "de". Expected one of: en, es, fr.')
    })

    it('throws on empty string', () => {
      expect(() => languages.parseEntryId('')).toThrow('entryId cannot be empty')
    })

    it('throws on locale from middle of path', () => {
      expect(() => languages.parseEntryId('category/es/2025-01-22-post')).toThrow('Invalid entryId "category/es/2025-01-22-post". Unknown locale prefix "category". Expected one of: en, es, fr.')
    })

    it('handles locale prefix with trailing content', () => {
      const result = languages.parseEntryId('es/talks/2023-09-27-devcontainers')
      expect(result.cleanId).toBe('talks/2023-09-27-devcontainers')
      expect(result.locale).toBe('es')
    })

    it('rejects locale-only entry ids', () => {
      expect(() => languages.parseEntryId('es/')).toThrow('Invalid entryId "es/" — missing locale prefix')
    })

    it('rejects entry ids with a leading slash after locale', () => {
      expect(() => languages.parseEntryId('es//post')).toThrow('Invalid entryId "es//post" — missing locale prefix')
    })
  })
})
