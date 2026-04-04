import { describe, it, expect } from 'vitest'
import type { TranslationLink } from '@domain/translationLink'
import { buildHomeLinks, buildDetailLink, buildDetailLinks, buildStaticPageLinks, buildMissingLanguageLinks, buildAlternatesFromLinks } from '@i18n/languagePickerUtils'
import { languageKeys } from '@i18n/ui'

describe('languagePickerUtils', () => {
  describe('buildHomeLinks', () => {
    it('returns links for all languages pointing to site root', () => {
      const links = buildHomeLinks()

      expect(links).toHaveLength(languageKeys.length)
      expect(links.every(l => l.isAvailable)).toBe(true)
    })

    it('includes proper prefixes for each language', () => {
      const links = buildHomeLinks()
      const en = links.find(l => l.locale === 'en')
      const es = links.find(l => l.locale === 'es')

      expect(en?.href).toMatch(/^\/en/)
      expect(es?.href).toBeDefined()
    })
  })

  describe('buildDetailLink', () => {
    it('returns available link for existing translation', () => {
      const link = buildDetailLink('en', 'blog', { en: { slug: 'en-slug' } })
      expect(link.isAvailable).toBe(true)
      expect(link.href).toContain('blog/en-slug')
      expect(link.disabledReason).toBeUndefined()
    })

    it('marks draft translation with disabledReason draft', () => {
      const link = buildDetailLink('en', 'blog', { en: { slug: 'en-slug', draft: true } })
      expect(link.isAvailable).toBe(true)
      expect(link.disabledReason).toBe('draft')
      expect(link.href).toContain('blog/en-slug')
    })

    it('returns missing link when translation does not exist', () => {
      const link = buildDetailLink('en', 'blog', {})
      expect(link.isAvailable).toBe(false)
      expect(link.disabledReason).toBe('missing')
    })
  })

  describe('buildDetailLinks', () => {
    it('returns array of links for all languages', () => {
      const links = buildDetailLinks('blog', { en: { slug: 'en-slug' }, es: { slug: 'es-slug' } })

      expect(links).toHaveLength(languageKeys.length)
      expect(links.every(l => l.isAvailable)).toBe(true)
    })

    it('marks draft translations correctly', () => {
      const links = buildDetailLinks('blog', { en: { slug: 'en-slug', draft: true }, es: { slug: 'es-slug' } })

      const enLink = links.find(l => l.locale === 'en')
      const esLink = links.find(l => l.locale === 'es')
      expect(enLink?.disabledReason).toBe('draft')
      expect(esLink?.disabledReason).toBeUndefined()
    })

    it('includes missing translations in array', () => {
      const links = buildDetailLinks('blog', { en: { slug: 'en-slug' } })

      const enLink = links.find(l => l.locale === 'en')
      const esLink = links.find(l => l.locale === 'es')
      expect(enLink?.isAvailable).toBe(true)
      expect(esLink?.isAvailable).toBe(false)
      expect(esLink?.disabledReason).toBe('missing')
    })
  })

  describe('buildStaticPageLinks', () => {
    it('returns missing links when URL has no locale prefix', () => {
      const links = buildStaticPageLinks(new URL('http://x/cosito'))
      expect(links.every(l => !l.isAvailable && l.disabledReason === 'missing')).toBe(true)
    })

    it('uses rootMap for localized section slugs', () => {
      // about: { en: 'about', es: 'acerca-de' }
      const links = buildStaticPageLinks(new URL('http://x/es/acerca-de'))
      const es = links.find(l => l.locale === 'es')
      const en = links.find(l => l.locale === 'en')
      expect(es?.isAvailable).toBe(true)
      expect(es?.href).toContain('acerca-de')
      expect(en?.isAvailable).toBe(true)
      expect(en?.href).toContain('about')
    })

    it('handles unmapped sections gracefully', () => {
      const links = buildStaticPageLinks(new URL('http://x/es/custom-section'))
      const es = links.find(l => l.locale === 'es')
      const en = links.find(l => l.locale === 'en')
      expect(es?.isAvailable).toBe(true)
      expect(es?.href).toContain('custom-section')
      expect(en?.isAvailable).toBe(false)
    })
  })

  describe('buildMissingLanguageLinks', () => {
    it('returns all locales as unavailable', () => {
      const links = buildMissingLanguageLinks()
      expect(links).toHaveLength(languageKeys.length)
      expect(links.every(l => !l.isAvailable && l.disabledReason === 'missing')).toBe(true)
    })
  })

  describe('buildAlternatesFromLinks', () => {
    it('filters out unavailable links and returns locale/url pairs', () => {
      const links: TranslationLink[] = [
        { href: '/en/', isAvailable: true, locale: 'en' },
        { href: '', isAvailable: false, disabledReason: 'missing', locale: 'es' }
      ]

      const alternates = buildAlternatesFromLinks(links)
      expect(alternates).toEqual([{ locale: 'en', url: '/en/' }])
    })
  })
})
