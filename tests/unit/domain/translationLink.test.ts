import { describe, it, expect, vi } from 'vitest'
import { availableLink, missingLink, buildLangPrefix } from '@domain/translationLink'

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

describe('buildLangPrefix', () => {

  vi.mock('@i18n/config', () => ({
    showDefaultLang: false
  }))

  it('retorna string vacío para idioma por defecto cuando showDefaultLang es false', () => {
    const result = buildLangPrefix('es')
    expect(result).toBe('')
  })

  it('retorna /locale para idioma no por defecto', () => {
    const result = buildLangPrefix('en')
    expect(result).toBe('/en')
    expect(result).toMatch(/^\//)
  })
})
