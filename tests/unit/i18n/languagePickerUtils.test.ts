import { describe, it, expect } from 'vitest'
import type { TranslationLink } from '@domain/translationLink'
import { isAccessible, isAvailable, isDraft, isMissing } from '@domain/translationLink'
import { buildHomeLinks, buildDetailLink, buildDetailLinks, buildStaticPageLinks, buildMissingLanguageLinks, buildAlternatesFromLinks } from '@i18n/languagePickerUtils'
import { languageKeys } from '@i18n/ui'

describe('languagePickerUtils', () => {
  describe('buildHomeLinks', () => {
    it('returns links for all languages pointing to site root', () => {
      const links = buildHomeLinks()

      expect(links).toHaveLength(languageKeys.length)
      expect(links.every(l => isAccessible(l))).toBe(true)
      expect(links.every(l => isAvailable(l))).toBe(true)
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
      expect(isAccessible(link)).toBe(true)
      expect(isAvailable(link)).toBe(true)
      expect(link.href).toContain('blog/en-slug')
      expect(isDraft(link)).toBe(false)
    })

    it('marks draft translation', () => {
      const link = buildDetailLink('en', 'blog', { en: { slug: 'en-slug', draft: true } })
      expect(isAccessible(link)).toBe(true)
      expect(isAvailable(link)).toBe(false)
      expect(isDraft(link)).toBe(true)
      expect(link.href).toContain('blog/en-slug')
    })

    it('returns missing link when translation does not exist', () => {
      const link = buildDetailLink('en', 'blog', {})
      expect(isAccessible(link)).toBe(false)
      expect(isAvailable(link)).toBe(false)
      expect(isMissing(link)).toBe(true)
    })
  })

  describe('buildDetailLinks', () => {
    it('returns array of links for all languages', () => {
      const links = buildDetailLinks({ en: 'blog', es: 'blog' }, { en: { slug: 'en-slug' }, es: { slug: 'es-slug' } })

      expect(links).toHaveLength(languageKeys.length)
      expect(links.every(l => isAccessible(l))).toBe(true)
    })

    it('marks draft translations correctly', () => {
      const links = buildDetailLinks({ en: 'blog', es: 'blog' }, { en: { slug: 'en-slug', draft: true }, es: { slug: 'es-slug' } })

      const enLink = links.find(l => l.locale === 'en')
      const esLink = links.find(l => l.locale === 'es')
      expect(enLink).toBeDefined()
      expect(esLink).toBeDefined()
      expect(isDraft(enLink!)).toBe(true)
      expect(isDraft(esLink!)).toBe(false)
    })

    it('includes missing translations in array', () => {
      const links = buildDetailLinks({ en: 'blog', es: 'blog' }, { en: { slug: 'en-slug' } })

      const enLink = links.find(l => l.locale === 'en')
      const esLink = links.find(l => l.locale === 'es')
      expect(enLink).toBeDefined()
      expect(esLink).toBeDefined()
      expect(isAccessible(enLink!)).toBe(true)
      expect(isAvailable(enLink!)).toBe(true)
      expect(isAccessible(esLink!)).toBe(false)
      expect(isAvailable(esLink!)).toBe(false)
      expect(isMissing(esLink!)).toBe(true)
    })

    it('uses correct localized route for each language', () => {
      // This test validates the fix for the bug where sectionRoutes differed per language
      // (e.g., 'talk' in en, 'charla' in es)
      const links = buildDetailLinks(
        { en: 'talk', es: 'charla' },
        { en: { slug: 'en-talk-slug' }, es: { slug: 'es-charla-slug' } }
      )

      const enLink = links.find(l => l.locale === 'en')
      const esLink = links.find(l => l.locale === 'es')

      // Each link must use its own localized section route, not the one from the current entry's locale
      expect(enLink?.href).toContain('/en/talk/en-talk-slug')
      expect(esLink?.href).toContain('/es/charla/es-charla-slug')
    })
  })

  describe('buildStaticPageLinks', () => {
    it('returns missing links when URL has no locale prefix', () => {
      const links = buildStaticPageLinks(new URL('http://x/cosito'))
      expect(links.every(l => !isAccessible(l) && isMissing(l))).toBe(true)
    })

    it('uses rootMap for localized section slugs', () => {
      // about: { en: 'about', es: 'acerca-de' }
      const links = buildStaticPageLinks(new URL('http://x/es/acerca-de'))
      const es = links.find(l => l.locale === 'es')
      const en = links.find(l => l.locale === 'en')
      expect(es).toBeDefined()
      expect(en).toBeDefined()
      expect(isAccessible(es!)).toBe(true)
      expect(isAvailable(es!)).toBe(true)
      expect(es?.href).toContain('acerca-de')
      expect(isAccessible(en!)).toBe(true)
      expect(isAvailable(en!)).toBe(true)
      expect(en?.href).toContain('about')
    })

    it('handles unmapped sections gracefully', () => {
      const links = buildStaticPageLinks(new URL('http://x/es/custom-section'))
      const es = links.find(l => l.locale === 'es')
      const en = links.find(l => l.locale === 'en')
      expect(es).toBeDefined()
      expect(en).toBeDefined()
      expect(isAccessible(es!)).toBe(true)
      expect(isAvailable(es!)).toBe(true)
      expect(es?.href).toContain('custom-section')
      expect(isAccessible(en!)).toBe(false)
      expect(isAvailable(en!)).toBe(false)
    })
  })

  describe('buildMissingLanguageLinks', () => {
    it('returns all locales as unavailable', () => {
      const links = buildMissingLanguageLinks()
      expect(links).toHaveLength(languageKeys.length)
      expect(links.every(l => !isAccessible(l) && isMissing(l))).toBe(true)
    })
  })

  describe('buildAlternatesFromLinks', () => {
    it('filters out unavailable links and returns locale/url pairs', () => {
      const links: TranslationLink[] = [
        { type: 'available', href: '/en/', locale: 'en' },
        { type: 'missing', href: null, locale: 'es' }
      ]

      const alternates = buildAlternatesFromLinks(links)
      expect(alternates).toEqual([{ locale: 'en', url: '/en/' }])
    })
  })
})
