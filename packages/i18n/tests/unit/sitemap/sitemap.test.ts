import { describe, it, expect } from 'vitest'
import { generateSitemapXml } from '@secorto/i18n'
import type { SitemapUrlEntry, TranslationLink } from '@secorto/i18n'

describe('generateSitemapXml', () => {
  it('generates valid XML structure', () => {
    const translationLinks: TranslationLink<'en' | 'es'>[] = [
      { locale: 'en', href: 'https://example.com/en/page-1', accessible: true },
    ]

    const entries: SitemapUrlEntry<'en' | 'es'>[] = [
      {
        href: 'https://example.com/en/page-1',
        locale: 'en',
        translationKey: 'page-1',
        translationLinks,
        changefreq: 'weekly',
        priority: 0.8,
        defaultLocale: 'en',
      },
    ]

    const xml = generateSitemapXml(entries)
    expect(xml).toContain('<?xml version="1.0"')
    expect(xml).toContain('<urlset')
    expect(xml).toContain('</urlset>')
    expect(xml).toContain('<loc>https://example.com/en/page-1</loc>')
  })

  it('includes hreflang alternates for multiple locales', () => {
    const translationLinks: TranslationLink<'en' | 'es'>[] = [
      { locale: 'en', href: 'https://example.com/en/page-1', accessible: true },
      { locale: 'es', href: 'https://example.com/es/pagina-1', accessible: true },
    ]

    const entries: SitemapUrlEntry<'en' | 'es'>[] = [
      {
        href: 'https://example.com/en/page-1',
        locale: 'en',
        translationKey: 'page-1',
        translationLinks,
        changefreq: 'weekly',
        priority: 0.8,
        defaultLocale: 'en',
      },
    ]

    const xml = generateSitemapXml(entries)
    expect(xml).toContain('xhtml:link rel="alternate" hreflang="en"')
    expect(xml).toContain('xhtml:link rel="alternate" hreflang="es"')
    expect(xml).toContain('xhtml:link rel="alternate" hreflang="x-default"')
  })

  it('escapes XML special characters in URLs', () => {
    const translationLinks: TranslationLink<'en'>[] = [
      { locale: 'en', href: 'https://example.com/test?foo=bar&baz=qux', accessible: true },
    ]

    const entries: SitemapUrlEntry<'en'>[] = [
      {
        href: 'https://example.com/test?foo=bar&baz=qux',
        locale: 'en',
        translationKey: 'test',
        translationLinks,
        defaultLocale: 'en',
      },
    ]

    const xml = generateSitemapXml(entries)
    expect(xml).toContain('&amp;')
  })

  it('renders each translation group once', () => {
    const translationLinks: TranslationLink<'en' | 'es'>[] = [
      { locale: 'en', href: 'https://example.com/en/page-1', accessible: true },
      { locale: 'es', href: 'https://example.com/es/pagina-1', accessible: true },
    ]

    const entries: SitemapUrlEntry<'en' | 'es'>[] = [
      {
        href: 'https://example.com/en/page-1',
        locale: 'en',
        translationKey: 'page-1',
        translationLinks,
        defaultLocale: 'en',
      },
    ]

    const xml = generateSitemapXml(entries)
    // Should have exactly one <url> block for this translation group
    const urlBlocks = xml.match(/<url>/g)
    expect(urlBlocks).toHaveLength(1)
  })

  it('includes priority when provided', () => {
    const translationLinks: TranslationLink<'en'>[] = [
      { locale: 'en', href: 'https://example.com/en/page-1', accessible: true },
    ]

    const entries: SitemapUrlEntry<'en'>[] = [
      {
        href: 'https://example.com/en/page-1',
        locale: 'en',
        translationKey: 'page-1',
        translationLinks,
        priority: 0.9,
        defaultLocale: 'en',
      },
    ]

    const xml = generateSitemapXml(entries)
    expect(xml).toContain('<priority>0.9</priority>')
  })

  it('includes changefreq when provided', () => {
    const translationLinks: TranslationLink<'en'>[] = [
      { locale: 'en', href: 'https://example.com/en/page-1', accessible: true },
    ]

    const entries: SitemapUrlEntry<'en'>[] = [
      {
        href: 'https://example.com/en/page-1',
        locale: 'en',
        translationKey: 'page-1',
        translationLinks,
        changefreq: 'daily',
        defaultLocale: 'en',
      },
    ]

    const xml = generateSitemapXml(entries)
    expect(xml).toContain('<changefreq>daily</changefreq>')
  })

  it('includes lastmod when provided', () => {
    const translationLinks: TranslationLink<'en'>[] = [
      { locale: 'en', href: 'https://example.com/en/page-1', accessible: true },
    ]

    const entries: SitemapUrlEntry<'en'>[] = [
      {
        href: 'https://example.com/en/page-1',
        locale: 'en',
        translationKey: 'page-1',
        translationLinks,
        lastmod: '2024-01-15',
        defaultLocale: 'en',
      },
    ]

    const xml = generateSitemapXml(entries)
    expect(xml).toContain('<lastmod>2024-01-15</lastmod>')
  })

  it('uses defaultLocale for x-default hreflang', () => {
    const translationLinks: TranslationLink<'en' | 'es'>[] = [
      { locale: 'en', href: 'https://example.com/en/page', accessible: true },
      { locale: 'es', href: 'https://example.com/es/pagina', accessible: true },
    ]

    const entries: SitemapUrlEntry<'en' | 'es'>[] = [
      {
        href: 'https://example.com/en/page',
        locale: 'en',
        translationKey: 'page',
        translationLinks,
        defaultLocale: 'es',
      },
    ]

    const xml = generateSitemapXml(entries)
    expect(xml).toContain('hreflang="x-default" href="https://example.com/es/pagina"')
  })
})
