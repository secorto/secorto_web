import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockRootMap: Record<string, Record<string, string>> = {
  about: { en: 'about', es: 'acerca-de' },
}

vi.mock('@i18n/rootMap', () => ({
  get rootMap() { return mockRootMap },
  resolveCanonical: (raw: string, lang: string) => {
    const entry = Object.entries(mockRootMap).find(([, langs]) => langs[lang] === raw)
    return entry ? entry[0] : raw
  },
  resolveLocalized: (canonical: string, lang: string) => mockRootMap[canonical]?.[lang] ?? canonical,
}))

vi.mock('@i18n/config', () => ({ showDefaultLang: true }))

describe('languagePickerUtils', () => {
  it('buildHomeLink respects showDefaultLang', async () => {
    vi.resetModules()
    vi.doMock('@i18n/config', () => ({ showDefaultLang: true }))
    const { buildHomeLink } = await import('@i18n/languagePickerUtils')
    expect(buildHomeLink('en').href).toBe('/en/')

    vi.resetModules()
    vi.doMock('@i18n/config', () => ({ showDefaultLang: false }))
    const mod = await import('@i18n/languagePickerUtils')
    // defaultLang is 'es' — when showDefaultLang is false the default language omits the prefix
    expect(mod.buildHomeLink('es').href).toBe('/')
  })

  it('buildDetailLink for available translation', async () => {
    vi.resetModules()
    vi.doMock('@i18n/config', () => ({ showDefaultLang: true }))
    const { buildDetailLink } = await import('@i18n/languagePickerUtils')
    const link = buildDetailLink('en', 'blog', { en: { slug: 'en-slug' } })
    expect(link.isAvailable).toBe(true)
    expect(link.href).toBe('/en/blog/en-slug')
  })

  it('buildDetailLink marks missing translation', async () => {
    vi.resetModules()
    vi.doMock('@i18n/config', () => ({ showDefaultLang: true }))
    const { buildDetailLink } = await import('@i18n/languagePickerUtils')
    const link = buildDetailLink('en', 'blog', {})
    expect(link.isAvailable).toBe(false)
    expect(link.disabledReason).toBe('missing')
  })

  describe('buildStaticPageLinks', () => {
    beforeEach(() => {
      vi.resetModules()
      vi.doMock('@i18n/config', () => ({ showDefaultLang: true }))
      vi.doMock('@i18n/rootMap', () => ({
        get rootMap() { return mockRootMap },
        resolveCanonical: (raw: string, lang: string) => {
          const entry = Object.entries(mockRootMap).find(([, langs]) => langs[lang] === raw)
          return entry ? entry[0] : raw
        },
        resolveLocalized: (canonical: string, lang: string) => mockRootMap[canonical]?.[lang] ?? canonical,
      }))
    })

    it('no locale prefix → all links missing', async () => {
      const { buildStaticPageLinks } = await import('@i18n/languagePickerUtils')
      const links = buildStaticPageLinks(new URL('http://x/cosito'))
      expect(links.es.isAvailable).toBe(false)
      expect(links.en.isAvailable).toBe(false)
      expect(links.es.disabledReason).toBe('missing')
    })

    it('section in rootMap → links use localized slugs', async () => {
      const { buildStaticPageLinks } = await import('@i18n/languagePickerUtils')
      const links = buildStaticPageLinks(new URL('http://x/es/acerca-de'))
      expect(links.es.isAvailable).toBe(true)
      expect(links.es.href).toBe('/es/acerca-de')
      expect(links.en.isAvailable).toBe(true)
      expect(links.en.href).toBe('/en/about')
    })

    it('canonicalSection override is used instead of resolving from URL', async () => {
      const { buildStaticPageLinks } = await import('@i18n/languagePickerUtils')
      const links = buildStaticPageLinks(new URL('http://x/en/about'), 'about')
      expect(links.en.href).toBe('/en/about')
      expect(links.es.href).toBe('/es/acerca-de')
    })

    it('section not in rootMap → current locale available, others missing', async () => {
      const { buildStaticPageLinks } = await import('@i18n/languagePickerUtils')
      const links = buildStaticPageLinks(new URL('http://x/es/cosito'))
      expect(links.es.isAvailable).toBe(true)
      expect(links.es.href).toBe('/es/cosito')
      expect(links.en.isAvailable).toBe(false)
      expect(links.en.disabledReason).toBe('missing')
    })

    it('section in rootMap but missing one locale → that locale is missing', async () => {
      mockRootMap['partial'] = { es: 'parcial' } as Record<string, string>
      const { buildStaticPageLinks } = await import('@i18n/languagePickerUtils')
      const links = buildStaticPageLinks(new URL('http://x/es/parcial'))
      expect(links.es.isAvailable).toBe(true)
      expect(links.en.isAvailable).toBe(false)
      expect(links.en.disabledReason).toBe('missing')
      delete mockRootMap['partial']
    })
  })
})
