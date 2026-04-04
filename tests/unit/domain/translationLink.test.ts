import { describe, it, expect } from 'vitest'
import { availableLink, missingLink, isAvailable } from '@domain/translationLink'

describe('availableLink', () => {
  it('crea un TranslationLink disponible con href y locale correcto', () => {
    const result = availableLink('/blog', 'en')

    expect(result).toEqual({
      type: 'available',
      href: '/blog',
      locale: 'en'
    })
    expect(isAvailable(result)).toBe(true)
  })

  it('preserva href exactamente como se proporciona', () => {
    const result = availableLink('/en/blog/tags/typescript', 'en')
    expect(result.href).toBe('/en/blog/tags/typescript')
  })

  it('asigna locale para múltiples idiomas', () => {
    const en = availableLink('/', 'en')
    const es = availableLink('/', 'es')

    expect(en.locale).toBe('en')
    expect(es.locale).toBe('es')
  })
})

describe('missingLink', () => {
  it('crea un TranslationLink no disponible de tipo missing', () => {
    const result = missingLink('en')
    expect(result).toEqual({
      type: 'missing',
      href: null,
      locale: 'en'
    })
  })

  it('asigna locale para múltiples idiomas', () => {
    const en = missingLink('en')
    const es = missingLink('es')

    expect(en.locale).toBe('en')
    expect(es.locale).toBe('es')
  })
})
