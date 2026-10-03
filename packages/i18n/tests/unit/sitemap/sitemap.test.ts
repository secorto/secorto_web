import { describe, it, expect } from 'vitest'
import { generateSitemapXml } from '@secorto/i18n'
import type { SitemapUrlEntry } from '@secorto/i18n'

describe('generateSitemapXml', () => {
  it('generates valid XML structure', () => {
    const entries: SitemapUrlEntry<'en' | 'es'>[] = [
      {
        url: 'https://example.com/en/page-1',
        locale: 'en',
        translationKey: 'page-1',
        changefreq: 'weekly',
        priority: 0.8,
        siblings: [],
      },
    ]
    entries[0].siblings = entries

    const xml = generateSitemapXml(entries)
    expect(xml).toContain('<?xml version="1.0"')
    expect(xml).toContain('<urlset')
    expect(xml).toContain('</urlset>')
    expect(xml).toContain('<loc>https://example.com/en/page-1</loc>')
  })

  it('includes hreflang alternates for multiple locales', () => {
    const entries: SitemapUrlEntry<'en' | 'es'>[] = [
      {
        url: 'https://example.com/en/page-1',
        locale: 'en',
        translationKey: 'page-1',
        changefreq: 'weekly',
        priority: 0.8,
        siblings: [],
      },
      {
        url: 'https://example.com/es/pagina-1',
        locale: 'es',
        translationKey: 'page-1',
        changefreq: 'weekly',
        priority: 0.8,
        siblings: [],
      },
    ]
    entries[0].siblings = entries
    entries[1].siblings = entries

    const xml = generateSitemapXml(entries)
    expect(xml).toContain('xhtml:link rel="alternate" hreflang="en"')
    expect(xml).toContain('xhtml:link rel="alternate" hreflang="es"')
    expect(xml).toContain('xhtml:link rel="alternate" hreflang="x-default"')
  })

  it('escapes XML special characters in URLs', () => {
    const entries: SitemapUrlEntry<'en'>[] = [
      {
        url: 'https://example.com/test?foo=bar&baz=qux',
        locale: 'en',
        translationKey: 'test',
        siblings: [],
      },
    ]
    entries[0].siblings = entries

    const xml = generateSitemapXml(entries)
    expect(xml).toContain('&amp;')
  })

  it('renders each translation group only once', () => {
    const entries: SitemapUrlEntry<'en' | 'es'>[] = [
      {
        url: 'https://example.com/en/page-1',
        locale: 'en',
        translationKey: 'page-1',
        siblings: [],
      },
      {
        url: 'https://example.com/es/pagina-1',
        locale: 'es',
        translationKey: 'page-1',
        siblings: [],
      },
    ]
    entries[0].siblings = entries
    entries[1].siblings = entries

    const xml = generateSitemapXml(entries)
    // Should have exactly one <url> block for this group
    const urlBlocks = xml.match(/<url>/g)
    expect(urlBlocks).toHaveLength(1)
  })

  it('includes priority when provided', () => {
    const entries: SitemapUrlEntry<'en'>[] = [
      {
        url: 'https://example.com/en/page-1',
        locale: 'en',
        translationKey: 'page-1',
        priority: 0.9,
        siblings: [],
      },
    ]
    entries[0].siblings = entries

    const xml = generateSitemapXml(entries)
    expect(xml).toContain('<priority>0.9</priority>')
  })

  it('includes changefreq when provided', () => {
    const entries: SitemapUrlEntry<'en'>[] = [
      {
        url: 'https://example.com/en/page-1',
        locale: 'en',
        translationKey: 'page-1',
        changefreq: 'daily',
        siblings: [],
      },
    ]
    entries[0].siblings = entries

    const xml = generateSitemapXml(entries)
    expect(xml).toContain('<changefreq>daily</changefreq>')
  })

  it('includes lastmod when provided', () => {
    const entries: SitemapUrlEntry<'en'>[] = [
      {
        url: 'https://example.com/en/page-1',
        locale: 'en',
        translationKey: 'page-1',
        lastmod: '2024-01-15',
        siblings: [],
      },
    ]
    entries[0].siblings = entries

    const xml = generateSitemapXml(entries)
    expect(xml).toContain('<lastmod>2024-01-15</lastmod>')
  })

  it('uses isPrimary flag for x-default hreflang', () => {
    const entries: SitemapUrlEntry<'en' | 'es'>[] = [
      {
        url: 'https://example.com/en/page',
        locale: 'en',
        translationKey: 'page',
        siblings: [],
      },
      {
        url: 'https://example.com/es/pagina',
        locale: 'es',
        translationKey: 'page',
        isPrimary: true,
        siblings: [],
      },
    ]
    entries[0].siblings = entries
    entries[1].siblings = entries

    const xml = generateSitemapXml(entries)
    expect(xml).toContain('hreflang="x-default" href="https://example.com/es/pagina"')
  })
})
