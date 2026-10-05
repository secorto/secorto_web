import { describe, expect, it } from 'vitest'
import {
  availableLink,
  draftLink,
  generateSitemapXml,
  generateUrlBlock,
  type SitemapEntry,
  type TranslationLink,
} from '@secorto/i18n'

const site = 'https://secorto.com'

describe('generateSitemapXml', () => {
  it('generates valid XML structure', () => {
    const translationLinks: TranslationLink<'en' | 'es'>[] = [
      availableLink('en/page-1', 'en'),
    ]

    const entries: SitemapEntry<'en' | 'es'>[] = [
      {
        href: 'en/page-1',
        locale: 'en',
        translationLinks,
        changefreq: 'weekly',
        priority: 0.8,
        defaultLink: availableLink('en/page-1', 'en'),
      },
    ]

    const xml = generateSitemapXml(site, entries)
    expect(xml).toContain('<?xml version="1.0"')
    expect(xml).toContain('<urlset')
    expect(xml).toContain('</urlset>')
    expect(xml).toContain('<loc>https://secorto.com/en/page-1</loc>')
  })

  it('includes hreflang alternates for multiple locales', () => {
    const translationLinks: TranslationLink<'en' | 'es'>[] = [
      availableLink('en/page-1', 'en'),
      availableLink('es/pagina-1', 'es'),
    ]

    const entries: SitemapEntry<'en' | 'es'>[] = [
      {
        href: 'en/page-1',
        locale: 'en',
        translationLinks,
        changefreq: 'weekly',
        priority: 0.8,
        defaultLink: availableLink('en/page-1', 'en'),
      },
    ]

    const xml = generateSitemapXml(site, entries)
    expect(xml).toContain('xhtml:link rel="alternate" hreflang="en"')
    expect(xml).toContain('xhtml:link rel="alternate" hreflang="es"')
    expect(xml).toContain('xhtml:link rel="alternate" hreflang="x-default"')
  })

  it('escapes XML special characters in URLs', () => {
    const translationLinks: TranslationLink<'en'>[] = [
      availableLink('test?foo=bar&baz=qux', 'en'),
    ]

    const entries: SitemapEntry<'en'>[] = [
      {
        href: 'test?foo=bar&baz=qux',
        locale: 'en',
        translationLinks,
        changefreq: 'weekly',
        priority: 0.8,
        defaultLink: availableLink('test?foo=bar&baz=qux', 'en'),
      },
    ]

    const xml = generateSitemapXml(site, entries)
    expect(xml).toContain('&amp;')
  })

  it('renders each translation group once', () => {
    const translationLinks: TranslationLink<'en' | 'es'>[] = [
      availableLink('en/page-1', 'en'),
      availableLink('es/pagina-1', 'es'),
    ]

    const entries: SitemapEntry<'en' | 'es'>[] = [
      {
        href: 'en/page-1',
        locale: 'en',
        translationLinks,
        changefreq: 'weekly',
        priority: 0.8,
        defaultLink: availableLink('en/page-1', 'en'),
      },
    ]

    const xml = generateSitemapXml(site, entries)
    const urlBlocks = xml.match(/<url>/g)
    expect(urlBlocks).toHaveLength(1)
  })

  it('includes priority when provided', () => {
    const translationLinks: TranslationLink<'en'>[] = [
      availableLink('en/page-1', 'en'),
    ]

    const entries: SitemapEntry<'en'>[] = [
      {
        href: 'en/page-1',
        locale: 'en',
        translationLinks,
        changefreq: 'weekly',
        priority: 0.9,
        defaultLink: availableLink('en/page-1', 'en'),
      },
    ]

    const xml = generateSitemapXml(site, entries)
    expect(xml).toContain('<priority>0.9</priority>')
  })

  it('includes changefreq when provided', () => {
    const translationLinks: TranslationLink<'en'>[] = [
      availableLink('en/page-1', 'en'),
    ]

    const entries: SitemapEntry<'en'>[] = [
      {
        href: 'en/page-1',
        locale: 'en',
        translationLinks,
        changefreq: 'daily',
        priority: 0.8,
        defaultLink: availableLink('en/page-1', 'en'),
      },
    ]

    const xml = generateSitemapXml(site, entries)
    expect(xml).toContain('<changefreq>daily</changefreq>')
  })

  it('includes lastmod when provided', () => {
    const translationLinks: TranslationLink<'en'>[] = [
      availableLink('en/page-1', 'en'),
    ]

    const entries: SitemapEntry<'en'>[] = [
      {
        href: 'en/page-1',
        locale: 'en',
        translationLinks,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: '2024-01-15',
        defaultLink: availableLink('en/page-1', 'en'),
      },
    ]

    const xml = generateSitemapXml(site, entries)
    expect(xml).toContain('<lastmod>2024-01-15</lastmod>')
  })

  it('uses defaultLink for x-default hreflang', () => {
    const translationLinks: TranslationLink<'en' | 'es'>[] = [
      availableLink('en/page', 'en'),
      availableLink('es/pagina', 'es'),
    ]

    const entries: SitemapEntry<'en' | 'es'>[] = [
      {
        href: 'en/page',
        locale: 'en',
        translationLinks,
        changefreq: 'weekly',
        priority: 0.8,
        defaultLink: availableLink('es/pagina', 'es'),
      },
    ]

    const xml = generateSitemapXml(site, entries)
    expect(xml).toContain('hreflang="x-default" href="https://secorto.com/es/pagina"')
  })

  it('generateUrlBlock ignores draft links in alternates', () => {
    const entry: SitemapEntry<'en' | 'es'> = {
      href: 'en/page',
      locale: 'en',
      translationLinks: [
        availableLink('en/page', 'en'),
        draftLink('es/borrador', 'es'),
      ],
      changefreq: 'weekly',
      priority: 0.8,
      defaultLink: availableLink('https://secorto.com/en/page', 'en'),
    }

    const xml = generateUrlBlock(site, entry)

    expect(xml).toContain('hreflang="en"')
    expect(xml).toContain('hreflang="x-default" href="https://secorto.com/en/page"')
    expect(xml).not.toContain('hreflang="es"')
    expect(xml).not.toContain('es/borrador')
  })

  it('generateUrlBlock omits x-default when defaultLink is undefined', () => {
    const entry: SitemapEntry<'en' | 'es'> = {
      href: 'en/page',
      locale: 'en',
      translationLinks: [
        availableLink('en/page', 'en'),
      ],
      changefreq: 'weekly',
      priority: 0.8,
    }

    const xml = generateUrlBlock(site, entry)

    expect(xml).toContain('hreflang="en"')
    expect(xml).not.toContain('hreflang="x-default"')
  })
})
