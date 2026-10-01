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

  it('handles the 404 edge case where Astro.currentLocale is undefined', () => {
    // This simulates the case described in the GitHub review
    // where non-i18n routes like /404 don't have a locale context
    const localeFromNonI18nRoute = undefined
    expect(getLocale(localeFromNonI18nRoute)).toBe('es')
  })

  it('throws when currentLocale is an unsupported locale', () => {
    expect(() => getLocale('xx')).toThrow('Invalid language: xx')
    expect(() => getLocale('de')).toThrow('Invalid language: de')
  })
})
