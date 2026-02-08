import { describe, it, expect, vi } from 'vitest'

// Mutable mocks used by tests. The factories below are hoisted by Vitest
// so we expose mutable objects that tests can adjust before importing
// the module under test.
const uiMock = {
  defaultLang: 'es',
  showDefaultLang: true,
  languages: { en: 'English', es: 'Spanish' },
}

vi.mock('@i18n/ui', () => uiMock)

vi.mock('@i18n/rootMap', () => ({
  resolveLocalized: (canonical: string, _lang: string) => canonical
}))

type TranslationsMock = {
  translations: Record<string, Record<string, { noTranslate?: string[] }>>
}

const translationsMock: TranslationsMock = {
  translations: {
    blog: {
      '2025-01-01-title': { noTranslate: ['en'] },
      '2025-02-01-title': {},
    },
  },
}

vi.mock('@i18n/translations', () => translationsMock)

describe('languagePickerUtils', () => {
  it('buildHomeLink omite prefijo del idioma por defecto cuando showDefaultLang=false', async () => {
    vi.resetModules()
    uiMock.showDefaultLang = false
    const { buildHomeLink } = await import('@i18n/languagePickerUtils')

    const es = buildHomeLink('es')
    expect(es.href).toBe('/')

    const en = buildHomeLink('en')
    expect(en.href).toBe('/en/')
  })

  it('buildHomeLink incluye prefijo del idioma por defecto cuando showDefaultLang=true', async () => {
    vi.resetModules()
    uiMock.showDefaultLang = true
    const { buildHomeLink } = await import('@i18n/languagePickerUtils')

    const es = buildHomeLink('es')
    expect(es.href).toBe('/es/')

    const en = buildHomeLink('en')
    expect(en.href).toBe('/en/')
  })

  it('buildTagLink y buildCollectionLink generan rutas localizadas', async () => {
    vi.resetModules()
    uiMock.showDefaultLang = true
    const { buildTagLink, buildCollectionLink } = await import('@i18n/languagePickerUtils')

    const tag = buildTagLink('en', 'blog', 'tags/typescript')
    expect(tag.href).toBe('/en/blog/tags/typescript')

    const coll = buildCollectionLink('es', 'blog')
    expect(coll.href).toBe('/es/blog')
  })

  it('buildDetailLink retorna href correcto cuando la traducción existe', async () => {
    vi.resetModules()
    uiMock.showDefaultLang = true
    const { buildDetailLink } = await import('@i18n/languagePickerUtils')

    const availableLocales = { en: { slug: 'en-slug' } }
    const link = buildDetailLink('en', 'blog', '2025-02-01-title', availableLocales)

    expect(link.isAvailable).toBe(true)
    expect(link.href).toBe('/en/blog/en-slug')
  })

  it('buildDetailLink marca "no-translate" cuando la entrada está marcada como no traducible', async () => {
    vi.resetModules()
    uiMock.showDefaultLang = true
    const { buildDetailLink, DISABLED_REASON_CONFIG } = await import('@i18n/languagePickerUtils')

    const availableLocales: Record<string, { slug: string }> = {}
    const link = buildDetailLink('en', 'blog', '2025-01-01-title', availableLocales)

    expect(link.isAvailable).toBe(false)
    expect(link.disabledReason).toBe('no-translate')
    expect(link.marker).toBe(DISABLED_REASON_CONFIG['no-translate'].marker)
    expect(link.title).toBe(DISABLED_REASON_CONFIG['no-translate'].title)
  })

  it('buildDetailLink marca "not-available" cuando no hay traducción y no está explícitamente excluida', async () => {
    vi.resetModules()
    uiMock.showDefaultLang = true

    // Adjust translations mock to a map that does not include noTranslate for this slug

    translationsMock.translations = { blog: { '2025-03-01-title': {} } }

    const { buildDetailLink, DISABLED_REASON_CONFIG } = await import('@i18n/languagePickerUtils')

    const availableLocales: Record<string, { slug: string }> = {}
    const link = buildDetailLink('en', 'blog', '2025-03-01-title', availableLocales)

    expect(link.isAvailable).toBe(false)
    expect(link.disabledReason).toBe('not-available')
    expect(link.marker).toBe(DISABLED_REASON_CONFIG['not-available'].marker)
    expect(link.title).toBe(DISABLED_REASON_CONFIG['not-available'].title)
  })
})
