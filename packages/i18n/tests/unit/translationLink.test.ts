import { describe, it, expect } from 'vitest'
import {
  availableLink,
  missingLink,
  draftLink,
  isAccessible,
  isAvailable,
  isDraft,
  isMissing,
  resolveDefaultAccessibleLink,
} from '@secorto/i18n'

describe('availableLink', () => {
  it('creates an available link with correct href and locale', () => {
    const result = availableLink('/en/blog', 'en')
    expect(result).toEqual({ type: 'available', href: '/en/blog', locale: 'en' })
    expect(isAvailable(result)).toBe(true)
    expect(isAccessible(result)).toBe(true)
  })
})

describe('missingLink', () => {
  it('creates a missing link with null href', () => {
    const result = missingLink('es')
    expect(result).toEqual({ type: 'missing', href: null, locale: 'es' })
    expect(isMissing(result)).toBe(true)
    expect(isAccessible(result)).toBe(false)
  })
})

describe('draftLink', () => {
  it('creates a draft link with href', () => {
    const result = draftLink('/en/blog/draft-post', 'en')
    expect(result).toEqual({ type: 'draft', href: '/en/blog/draft-post', locale: 'en' })
    expect(isDraft(result)).toBe(true)
    expect(isAccessible(result)).toBe(true)
    expect(isAvailable(result)).toBe(false)
  })
})

describe('resolveDefaultAccessibleLink', () => {
  it('prefers defaultLang available link', () => {
    const links = [availableLink('/en/slug', 'en'), availableLink('/es/slug', 'es')]
    expect(resolveDefaultAccessibleLink(links, 'es')?.locale).toBe('es')
  })

  it('falls back to first available when defaultLang is missing', () => {
    const links = [availableLink('/en/slug', 'en'), missingLink('es')]
    expect(resolveDefaultAccessibleLink(links, 'es')?.locale).toBe('en')
  })

  it('prefers defaultLang draft over other drafts', () => {
    const links = [draftLink('/en/slug', 'en'), draftLink('/es/slug', 'es')]
    expect(resolveDefaultAccessibleLink(links, 'es')?.locale).toBe('es')
  })

  it('prefers the first available draft when only', () => {
    const links = [draftLink('/en/slug', 'en'), draftLink('/en/slug', 'fr')]
    expect(resolveDefaultAccessibleLink(links, 'es')?.locale).toBe('en')
  })


  it('returns undefined when all links are missing', () => {
    const links = [missingLink('en'), missingLink('es')]
    expect(() => resolveDefaultAccessibleLink(links, 'es')).toThrow('resolveDefaultAccessibleLink: expected at least one accessible link')
  })

  it('throws on empty array', () => {
    expect(() => resolveDefaultAccessibleLink([], 'es')).toThrow('resolveDefaultAccessibleLink: unexpected empty links array')
  })
})
