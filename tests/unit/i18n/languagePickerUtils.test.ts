import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { UILanguages } from '@i18n/ui'
import type { TranslationLink } from '@domain/translationLink'

const mockRootMap: Record<string, Record<string, string>> = {
  about: { en: 'about', es: 'acerca-de' },
  blog: { en: 'blog', es: 'blog' },
}

vi.mock('@i18n/rootMap', () => ({
  get rootMap() { return mockRootMap },
  findCanonicalSectionKey: (raw: string, lang: string) => {
    const entry = Object.entries(mockRootMap).find(([, langs]) => langs[lang] === raw)
    return entry ? entry[0] : raw
  },
  findSectionMap: (raw: string, lang: string) => {
    return Object.entries(mockRootMap).find(([, langs]) => langs[lang] === raw)?.[1]
  },
  resolveLocalized: (canonical: string, lang: string) => mockRootMap[canonical]?.[lang] ?? canonical,
}))

vi.mock('@i18n/config', () => ({ showDefaultLang: true }))

describe('languagePickerUtils', () => {
  describe('buildHomeLink', () => {
    it('returns correct href and label for non-default lang', async () => {
      vi.resetModules()
      vi.doMock('@i18n/config', () => ({ showDefaultLang: true }))
      const { buildHomeLink } = await import('@i18n/languagePickerUtils')
      const link = buildHomeLink('en')
      expect(link.href).toBe('/en/')
      expect(link.label).toBe('English')
      expect(link.isAvailable).toBe(true)
    })

    it('omits locale prefix for defaultLang when showDefaultLang is false', async () => {
      vi.resetModules()
      vi.doMock('@i18n/config', () => ({ showDefaultLang: false }))
      const { buildHomeLink } = await import('@i18n/languagePickerUtils')
      // defaultLang is 'es'
      expect(buildHomeLink('es').href).toBe('/')
    })
  })

  describe('buildLanguageLinks', () => {
    it('maps builder result to every language key', async () => {
      const { buildLanguageLinks } = await import('@i18n/languagePickerUtils')
      const { languageKeys } = await import('@i18n/ui')
      const calls: string[] = []
      const links = buildLanguageLinks(l => {
        calls.push(l)
        return { href: `/${l}/x`, label: l === 'en' ? 'English' : 'Spanish', isAvailable: true, locale: l as UILanguages }
      })

      expect(calls).toHaveLength(languageKeys.length)
      for (const k of languageKeys) {
        expect(links[k].href).toBe(`/${k}/x`)
        expect(links[k].isAvailable).toBe(true)
      }
    })
  })

  describe('buildTagLink', () => {
    it('returns available link when locale has a slug', async () => {
      vi.resetModules()
      vi.doMock('@i18n/config', () => ({ showDefaultLang: true }))
      vi.doMock('@i18n/rootMap', () => ({
        get rootMap() { return mockRootMap },
        resolveLocalized: (canonical: string, lang: string) => mockRootMap[canonical]?.[lang] ?? canonical,
      }))
      const { buildTagLink } = await import('@i18n/languagePickerUtils')
      const link = buildTagLink('en', 'blog', { en: 'tools', es: 'herramientas' })
      expect(link.isAvailable).toBe(true)
      expect(link.href).toBe('/en/blog/tags/tools')
    })

    it('returns missing when locale has no slug', async () => {
      vi.resetModules()
      vi.doMock('@i18n/config', () => ({ showDefaultLang: true }))
      vi.doMock('@i18n/rootMap', () => ({
        get rootMap() { return mockRootMap },
        resolveLocalized: (canonical: string, lang: string) => mockRootMap[canonical]?.[lang] ?? canonical,
      }))
      const { buildTagLink } = await import('@i18n/languagePickerUtils')
      const link = buildTagLink('en', 'blog', { es: 'herramientas' })
      expect(link.isAvailable).toBe(false)
      expect(link.disabledReason).toBe('missing')
    })

    it('uses translated section route per locale', async () => {
      vi.resetModules()
      vi.doMock('@i18n/config', () => ({ showDefaultLang: true }))
      vi.doMock('@i18n/rootMap', () => ({
        get rootMap() { return mockRootMap },
        resolveLocalized: (_canonical: string, lang: string) => lang === 'es' ? 'charla' : 'talk',
      }))
      const { buildTagLink } = await import('@i18n/languagePickerUtils')
      const link = buildTagLink('es', 'talk', { es: 'testing', en: 'testing' })
      expect(link.href).toBe('/es/charla/tags/testing')
    })
  })

  describe('buildCollectionLink', () => {
    it('returns localized href for the section', async () => {
      vi.resetModules()
      vi.doMock('@i18n/config', () => ({ showDefaultLang: true }))
      vi.doMock('@i18n/rootMap', () => ({
        get rootMap() { return mockRootMap },
        resolveLocalized: (canonical: string, lang: string) => mockRootMap[canonical]?.[lang] ?? canonical,
      }))
      const { buildCollectionLink } = await import('@i18n/languagePickerUtils')
      expect(buildCollectionLink('en', 'about').href).toBe('/en/about')
      expect(buildCollectionLink('es', 'about').href).toBe('/es/acerca-de')
      expect(buildCollectionLink('en', 'about').isAvailable).toBe(true)
    })
  })

  describe('buildDetailLink', () => {
    it('returns available link for existing translation', async () => {
      vi.resetModules()
      vi.doMock('@i18n/config', () => ({ showDefaultLang: true }))
      vi.doMock('@i18n/rootMap', () => ({
        get rootMap() { return mockRootMap },
        resolveLocalized: (canonical: string, lang: string) => mockRootMap[canonical]?.[lang] ?? canonical,
      }))
      const { buildDetailLink } = await import('@i18n/languagePickerUtils')
      const link = buildDetailLink('en', 'blog', { en: { slug: 'en-slug' } })
      expect(link.isAvailable).toBe(true)
      expect(link.href).toBe('/en/blog/en-slug')
      expect(link.disabledReason).toBeUndefined()
    })

    it('marks draft translation as available with disabledReason draft', async () => {
      vi.resetModules()
      vi.doMock('@i18n/config', () => ({ showDefaultLang: true }))
      vi.doMock('@i18n/rootMap', () => ({
        get rootMap() { return mockRootMap },
        resolveLocalized: (canonical: string, lang: string) => mockRootMap[canonical]?.[lang] ?? canonical,
      }))
      const { buildDetailLink } = await import('@i18n/languagePickerUtils')
      const link = buildDetailLink('en', 'blog', { en: { slug: 'en-slug', draft: true } })
      expect(link.isAvailable).toBe(true)
      expect(link.disabledReason).toBe('draft')
      expect(link.href).toBe('/en/blog/en-slug')
    })

    it('marks missing translation', async () => {
      vi.resetModules()
      vi.doMock('@i18n/config', () => ({ showDefaultLang: true }))
      vi.doMock('@i18n/rootMap', () => ({
        get rootMap() { return mockRootMap },
        resolveLocalized: (canonical: string, lang: string) => mockRootMap[canonical]?.[lang] ?? canonical,
      }))
      const { buildDetailLink } = await import('@i18n/languagePickerUtils')
      const link = buildDetailLink('en', 'blog', {})
      expect(link.isAvailable).toBe(false)
      expect(link.disabledReason).toBe('missing')
    })
  })

  describe('buildStaticPageLinks', () => {
    beforeEach(() => {
      vi.resetModules()
      vi.doMock('@i18n/config', () => ({ showDefaultLang: true }))
      vi.doMock('@i18n/rootMap', () => ({
        get rootMap() { return mockRootMap },
        findCanonicalSectionKey: (raw: string, lang: string) => {
          const entry = Object.entries(mockRootMap).find(([, langs]) => langs[lang] === raw)
          return entry ? entry[0] : raw
        },
        findSectionMap: (raw: string, lang: string) => {
          return Object.entries(mockRootMap).find(([, langs]) => langs[lang] === raw)?.[1]
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

  describe('buildCollectionLinkFromRoutes', () => {
    it('returns localized href using routes map directly', async () => {
      vi.resetModules()
      vi.doMock('@i18n/config', () => ({ showDefaultLang: true }))
      const { buildCollectionLinkFromRoutes } = await import('@i18n/languagePickerUtils')
      const routes = { en: 'about', es: 'acerca-de' }
      expect(buildCollectionLinkFromRoutes('en', routes).href).toBe('/en/about')
      expect(buildCollectionLinkFromRoutes('es', routes).href).toBe('/es/acerca-de')
      expect(buildCollectionLinkFromRoutes('en', routes).isAvailable).toBe(true)
    })

    it('omits locale prefix for defaultLang when showDefaultLang is false', async () => {
      vi.resetModules()
      vi.doMock('@i18n/config', () => ({ showDefaultLang: false }))
      const { buildCollectionLinkFromRoutes } = await import('@i18n/languagePickerUtils')
      const routes = { en: 'about', es: 'acerca-de' }
      // defaultLang is 'es'
      expect(buildCollectionLinkFromRoutes('es', routes).href).toBe('/acerca-de')
    })
  })

  describe('buildTagLinkFromRoutes', () => {
    it('returns available link when locale has a slug', async () => {
      vi.resetModules()
      vi.doMock('@i18n/config', () => ({ showDefaultLang: true }))
      const { buildTagLinkFromRoutes } = await import('@i18n/languagePickerUtils')
      const routes = { en: 'blog', es: 'blog' }
      const link = buildTagLinkFromRoutes('en', routes, { en: 'tools', es: 'herramientas' })
      expect(link.isAvailable).toBe(true)
      expect(link.href).toBe('/en/blog/tags/tools')
    })

    it('returns missing when locale has no slug', async () => {
      vi.resetModules()
      vi.doMock('@i18n/config', () => ({ showDefaultLang: true }))
      const { buildTagLinkFromRoutes } = await import('@i18n/languagePickerUtils')
      const routes = { en: 'blog', es: 'blog' }
      const link = buildTagLinkFromRoutes('en', routes, { es: 'herramientas' })
      expect(link.isAvailable).toBe(false)
      expect(link.disabledReason).toBe('missing')
    })

    it('uses the localized route slug from routes map', async () => {
      vi.resetModules()
      vi.doMock('@i18n/config', () => ({ showDefaultLang: true }))
      const { buildTagLinkFromRoutes } = await import('@i18n/languagePickerUtils')
      const routes = { en: 'talk', es: 'charla' }
      const link = buildTagLinkFromRoutes('es', routes, { es: 'testing', en: 'testing' })
      expect(link.href).toBe('/es/charla/tags/testing')
    })
  })

  describe('buildMissingLanguageLinks', () => {
    it('returns all locales unavailable with correct labels for 404 pages', async () => {
      const { buildMissingLanguageLinks } = await import('@i18n/languagePickerUtils')
      const { languages, languageKeys } = await import('@i18n/ui')
      const links = buildMissingLanguageLinks()

      expect(Object.keys(links)).toHaveLength(languageKeys.length)
      for (const lang of languageKeys as UILanguages[]) {
        const link = links[lang]
        expect(link.isAvailable).toBe(false)
        expect(link.disabledReason).toBe('missing')
        expect(link.href).toBe('')
        expect(link.label).toBe(languages[lang])
      }
    })
  })

  describe('buildAlternatesFromLinks', () => {
    it('filters out unavailable links and returns locale/url pairs', async () => {
      const { buildAlternatesFromLinks } = await import('@i18n/languagePickerUtils')
      const links: Record<string, TranslationLink> = {
        en: { href: '/en/', label: 'English', isAvailable: true, locale: 'en' },
        es: { href: '', label: 'Español', isAvailable: false, disabledReason: 'missing', locale: 'es' }
      }

      const alternates = buildAlternatesFromLinks(links)
      expect(alternates).toEqual([{ locale: 'en', url: '/en/' }])
    })
  })
})
