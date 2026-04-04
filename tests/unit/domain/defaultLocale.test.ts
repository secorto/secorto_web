import { describe, it, expect } from 'vitest'
import { availableLink, draftLink, missingLink, resolveDefaultAccessibleLink as resolveDefaultAccessibleLink } from '@domain/translationLink'

describe('resolveDefaultLocaleFromLinks', () => {
  it('prefers es when available (defaultLang)', () => {
    const links = [availableLink('/en/2025-01-01-calendar', 'en'), availableLink('/es/2025-01-01-calendario', 'es')]
    const result = resolveDefaultAccessibleLink(links)
    expect(result?.locale).toBe('es')
  })

  it('returns first available when only one exists', () => {
    const links = [missingLink('es'), availableLink('/en/2025-01-01-calendar', 'en')]
    const result = resolveDefaultAccessibleLink(links)
    expect(result?.locale).toBe('en')
  })

  it('prefers draft for defaultLang when present', () => {
    const links = [draftLink('/en/en-slug', 'en'), draftLink('/es/es-slug', 'es')]
    const result = resolveDefaultAccessibleLink(links)
    expect(result?.locale).toBe('es')
  })

  it('selects first draft when defaultLang draft not present', () => {
    const links = [draftLink('/en/en-slug', 'en'), missingLink('es')]
    const result = resolveDefaultAccessibleLink(links)
    expect(result?.locale).toBe('en')
  })

  it('returns undefined when all the items are missing', () => {
    const links = [missingLink('en'), missingLink('es')]
    const result = resolveDefaultAccessibleLink(links)
    expect(result).toBeUndefined()
  })

  it('throws error when links array is empty', () => {
    expect(() => resolveDefaultAccessibleLink([])).toThrow('resolveDefaultAccessibleLink: unexpected empty links array')
  })
})
