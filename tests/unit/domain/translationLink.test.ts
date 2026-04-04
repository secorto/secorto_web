import { describe, it, expect } from 'vitest'
import { availableLink, draftLink, missingLink } from '@domain/translationLink'

describe('availableLink', () => {
  it('crea un TranslationLink disponible con href, isAvailable true, y locale correcto', () => {
    const result = availableLink('/blog', 'en')

    expect(result).toEqual({
      href: '/blog',
      isAvailable: true,
      locale: 'en'
    })
    expect(result.disabledReason).toBeUndefined()
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
  it('crea un TranslationLink no disponible con disabledReason missing y href vacío', () => {
    const result = missingLink('en')

    expect(result).toEqual({
      href: '',
      isAvailable: false,
      disabledReason: 'missing',
      locale: 'en'
    })
  })

  it('href siempre es string vacío para cualquier idioma', () => {
    expect(missingLink('en').href).toBe('')
    expect(missingLink('es').href).toBe('')
  })

  it('asigna locale para múltiples idiomas', () => {
    const en = missingLink('en')
    const es = missingLink('es')

    expect(en.locale).toBe('en')
    expect(es.locale).toBe('es')
  })
})

describe('draftLink', () => {
  it('crea un TranslationLink disponible con disabledReason draft y href proporcionado', () => {
    const result = draftLink('/es/blog/mi-articulo', 'es')

    expect(result).toEqual({
      href: '/es/blog/mi-articulo',
      isAvailable: true,
      disabledReason: 'draft',
      locale: 'es'
    })
  })

  it('preserva href exactamente como se proporciona', () => {
    const result = draftLink('/en/blog/my-article', 'en')
    expect(result.href).toBe('/en/blog/my-article')
  })

  it('asigna locale para múltiples idiomas', () => {
    const en = draftLink('/en/blog/draft', 'en')
    const es = draftLink('/es/blog/borrador', 'es')

    expect(en.locale).toBe('en')
    expect(es.locale).toBe('es')
  })
})
