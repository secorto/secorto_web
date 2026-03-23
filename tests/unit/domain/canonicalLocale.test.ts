import { describe, it, expect } from 'vitest'
import { resolveSeriesCanonicalLocale } from "@domain/translation"

describe('resolveSeriesCanonicalLocale', () => {
  it('prefers es when available', () => {
    const available = { en: { slug: '2025-01-01-calendar' }, es: { slug: '2025-01-01-calendario' } }
    expect(resolveSeriesCanonicalLocale(available)).toBe('es')
  })

  it('returns first element when nothing matches', () => {
    const available = { en: { slug: '2025-01-01-calendar' } }
    expect(resolveSeriesCanonicalLocale(available)).toBe('en')
  })

  it('respects explicit canonical flag when present', () => {
    const available = { es: { slug: 'es-slug' }, en: { slug: 'en-slug', canonical: true } }
    expect(resolveSeriesCanonicalLocale(available)).toBe('en')
  })
})
