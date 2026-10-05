import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateSitemap } from '@domain/sitemap-adapter'
import { getCollection, type CollectionEntry } from 'astro:content'
import type { SectionType } from '@domain/section'

vi.mock('astro:content', () => ({
  getCollection: vi.fn(),
}))

function createMockCollectionEntry<T extends SectionType>(
  id: string,
  slug: string,
  collection: T,
  data: Record<string, unknown>
): CollectionEntry<T> {
  return {
    id,
    slug,
    body: '',
    collection,
    data: {
      title: 'Mock Title',
      draft: false,
      ...data,
    },
    rendered: undefined,
    filePath: `src/content/${collection}/${id}`,
  } as unknown as CollectionEntry<T>
}

describe('Sitemap Integration - generateSitemap', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debería consolidar todas las rutas y generar el XML final del sitemap sin errores', async () => {
    const mockBlogEntries: CollectionEntry<'blog'>[] = [
      createMockCollectionEntry('es/intro-python', 'es/intro-python', 'blog', {
        lang: 'es',
        translationId: 'python-key',
        tags: ['python'],
      }),
      createMockCollectionEntry('en/intro-python', 'en/intro-python', 'blog', {
        lang: 'en',
        translationId: 'python-key',
        tags: ['python'],
      }),
      createMockCollectionEntry('es/borrador', 'es/borrador', 'blog', {
        draft: true, // Debe ser ignorado por la lógica interna
      }),
    ]

    const mockTalkEntries: CollectionEntry<'talk'>[] = [
      createMockCollectionEntry('es/test-unitarios', 'es/test-unitarios', 'talk', {
        lang: 'es',
        translationId: 'testing-key',
        tags: ['testing'],
      }),
    ]

    const collectionMocks: Record<SectionType, CollectionEntry<SectionType>[]> = {
      blog: mockBlogEntries,
      talk: mockTalkEntries,
      work: [],
      projects: [],
      community: [],
    }

    vi.mocked(getCollection).mockImplementation(
      async (collection: SectionType) => collectionMocks[collection]
    )

    const sitemapXml = await generateSitemap('https://secorto.com')

    expect(sitemapXml).toBeTypeOf('string')
    expect(sitemapXml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(sitemapXml).toContain('<urlset')

    expect(sitemapXml).toContain('<loc>https://secorto.com/es/</loc>')
    expect(sitemapXml).toContain('<loc>https://secorto.com/en/</loc>')
    expect(sitemapXml).toContain('<loc>https://secorto.com/es/acerca-de</loc>')
    expect(sitemapXml).toContain('<loc>https://secorto.com/en/about</loc>')
    expect(sitemapXml).toContain('<loc>https://secorto.com/es/tags</loc>')
    expect(sitemapXml).toContain('<loc>https://secorto.com/en/tags</loc>')

    expect(sitemapXml).toContain('<loc>https://secorto.com/es/blog/intro-python</loc>')
    expect(sitemapXml).toContain('<loc>https://secorto.com/en/blog/intro-python</loc>')
    expect(sitemapXml).toContain('<loc>https://secorto.com/es/charla/test-unitarios</loc>')
    expect(sitemapXml).toContain('<loc>https://secorto.com/en/blog/tags/python</loc>')
    expect(sitemapXml).toContain('<loc>https://secorto.com/es/blog/tags/python</loc>')
    expect(sitemapXml).toContain('<loc>https://secorto.com/es/charla/tags/pruebas</loc>')


    expect(sitemapXml).toContain('hreflang="x-default"')
    expect(sitemapXml).toContain('hreflang="es"')
    expect(sitemapXml).toContain('hreflang="en"')

    expect(sitemapXml).not.toContain('https://secorto.com/es/blog/borrador')
  })
})
