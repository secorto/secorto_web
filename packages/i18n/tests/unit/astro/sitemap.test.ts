import { describe, it, expect } from 'vitest'
import {
  localePathsSitemapEntries,
  sectionPathsSitemapEntries,
  detailPathsSitemapEntries,
  toSitemapXml,
  type SitemapEntry,
} from '../../../src/astro/sitemap'
import {
  createSectionRoutes,
  createLocales,
  adaptToLocalizedEntry,
  type LocalizedEntry,
} from '../../../src'

describe('sitemap', () => {
  const locales = createLocales(
    ['es', 'en'] as const,
    {
      es: '/es',
      en: '/en',
    },
    (entryId: string) => {
      const [locale, cleanId] = entryId.split('/')
      return { locale: locale as 'es' | 'en', cleanId }
    }
  )

  describe('localePathsSitemapEntries', () => {
    it('generates single entry with all locale translations', () => {
      const entries = localePathsSitemapEntries(locales)

      expect(entries).toHaveLength(1)
      expect(entries[0].translations).toHaveProperty('es')
      expect(entries[0].translations).toHaveProperty('en')
    })

    it('generates valid sitemap entry structure', () => {
      const entries = localePathsSitemapEntries(locales)
      const entry = entries[0]

      expect(entry).toHaveProperty('translations')
      expect(entry).toHaveProperty('changefreq', 'daily')
      expect(entry).toHaveProperty('priority', 0.8)
    })
  })

  describe('sectionPathsSitemapEntries', () => {
    it('generates entries for each section', () => {
      const routes = createSectionRoutes(
        {
          blog: { es: 'blog', en: 'blog' },
          talk: { es: 'charla', en: 'talk' },
        },
        locales
      )

      const entries = sectionPathsSitemapEntries(routes, locales)

      expect(entries.length).toBeGreaterThan(0)
      expect(entries[0].translations).toHaveProperty('es')
      expect(entries[0].translations).toHaveProperty('en')
    })

    it('respects asymmetric section slugs', () => {
      const routes = createSectionRoutes(
        {
          talk: { es: 'charla', en: 'talk' },
        },
        locales
      )

      const entries = sectionPathsSitemapEntries(routes, locales)
      const entry = entries[0]

      expect(entry.translations.es.href).toContain('charla')
      expect(entry.translations.en.href).toContain('talk')
    })
  })

  describe('detailPathsSitemapEntries', () => {
    it('groups entries by translation key', () => {
      const entries: LocalizedEntry<'blog', any, 'es' | 'en'>[] = [
        {
          section: 'blog',
          cleanId: 'post-1',
          translationKey: 'post.1',
          locale: 'es',
          draft: false,
          original: { data: { title: 'Post 1' } } as any,
        },
        {
          section: 'blog',
          cleanId: 'post-1',
          translationKey: 'post.1',
          locale: 'en',
          draft: false,
          original: { data: { title: 'Post 1' } } as any,
        },
      ]

      const routes = createSectionRoutes(
        { blog: { es: 'blog', en: 'blog' } },
        locales
      )

      const sitemapEntries = detailPathsSitemapEntries(entries, routes, locales)

      expect(sitemapEntries).toHaveLength(1)
      expect(sitemapEntries[0].translations).toHaveProperty('es')
      expect(sitemapEntries[0].translations).toHaveProperty('en')
    })

    it('excludes draft entries by default', () => {
      const entries: LocalizedEntry<'blog', any, 'es' | 'en'>[] = [
        {
          section: 'blog',
          cleanId: 'post-1',
          translationKey: 'post.1',
          locale: 'es',
          draft: true,
          original: { data: { title: 'Post 1' } } as any,
        },
      ]

      const routes = createSectionRoutes(
        { blog: { es: 'blog', en: 'blog' } },
        locales
      )

      const sitemapEntries = detailPathsSitemapEntries(entries, routes, locales)

      expect(sitemapEntries).toHaveLength(0)
    })

    it('includes draft entries when option is set', () => {
      const entries: LocalizedEntry<'blog', any, 'es' | 'en'>[] = [
        {
          section: 'blog',
          cleanId: 'post-1',
          translationKey: 'post.1',
          locale: 'es',
          draft: true,
          original: { data: { title: 'Post 1' } } as any,
        },
      ]

      const routes = createSectionRoutes(
        { blog: { es: 'blog', en: 'blog' } },
        locales
      )

      const sitemapEntries = detailPathsSitemapEntries(entries, routes, locales, {
        includeDrafts: true,
      })

      expect(sitemapEntries).toHaveLength(1)
      expect(sitemapEntries[0].translations.es.draft).toBe(true)
    })
  })

  describe('toSitemapXml', () => {
    it('generates valid XML', () => {
      const entries: SitemapEntry<'es' | 'en'>[] = [
        {
          translations: {
            es: { href: '/es/blog', draft: false },
            en: { href: '/en/blog', draft: false },
          },
          priority: 0.7,
          changefreq: 'weekly',
        },
      ]

      const xml = toSitemapXml(entries, { site: 'https://example.com' })

      expect(xml.startsWith('<?xml')).toBe(true)
      expect(xml).toContain('<urlset')
      expect(xml).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')
      expect(xml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"')
      expect(xml).toContain('</urlset>')
    })

    it('includes hreflang links', () => {
      const entries: SitemapEntry<'es' | 'en'>[] = [
        {
          translations: {
            es: { href: '/es/blog', draft: false },
            en: { href: '/en/blog', draft: false },
          },
        },
      ]

      const xml = toSitemapXml(entries, { site: 'https://example.com' })

      expect(xml).toContain('xhtml:link')
      expect(xml).toContain('hreflang="es"')
      expect(xml).toContain('hreflang="en"')
    })

    it('escapes XML special characters', () => {
      const entries: SitemapEntry<'es' | 'en'>[] = [
        {
          translations: {
            es: { href: '/es/test&value', draft: false },
            en: { href: '/en/test&value', draft: false },
          },
        },
      ]

      const xml = toSitemapXml(entries, { site: 'https://example.com' })

      expect(xml).toContain('&amp;')
      expect(xml).not.toContain('&value')
    })
  })
})
