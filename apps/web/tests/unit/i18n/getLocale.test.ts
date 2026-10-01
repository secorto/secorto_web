import { describe, it, expect } from 'vitest'
import { getLocale, defaultLang } from '@i18n/ui'

describe('getLocale', () => {
  it('returns the normalized locale when currentLocale is a valid supported locale', () => {
    expect(getLocale('es')).toBe('es')
    expect(getLocale('en')).toBe('en')
  })

  it('returns defaultLang when currentLocale is undefined', () => {
    expect(getLocale(undefined)).toBe(defaultLang)
  })

  it('throws when currentLocale is an unsupported locale', () => {
    expect(() => getLocale('xx')).toThrow('Invalid language: xx')
    expect(() => getLocale('de')).toThrow('Invalid language: de')
  })
})
