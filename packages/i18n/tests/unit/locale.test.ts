import { describe, expect, it } from 'vitest'
import { createLocales } from '@secorto/i18n'


describe('createLocales', () => {
  const languages = createLocales(['en', 'es', 'fr'] as const)

  for (const k of languages.all) {
    it(`validates that fromString returns ${k} for input "${k}"`, () => {
      expect(languages.fromString(k)).toBe(k)
    })
  }

  it('an invalid value throws an error', () => {
    expect(() => languages.fromString('xx')).toThrow('Invalid language: xx')
  })

  it('undefined or unsafe values throw an error', () => {
    expect(() => languages.fromString(undefined)).toThrow('Invalid language: undefined')
  })
})
