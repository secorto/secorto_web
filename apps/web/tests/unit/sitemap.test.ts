import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateSitemap } from '@domain/sitemap-adapter' // Ajusta la ruta a tu archivo principal
import { getCollection, type CollectionEntry } from 'astro:content'
import type { SectionType } from '@domain/section'

// 1. Creamos el mock oficial de astro:content
vi.mock('astro:content', () => ({
  getCollection: vi.fn(),
}))

// Helper estrictamente tipado para generar entradas simuladas de Astro Content Collections
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
    // 2. Definimos datos estructurados para las colecciones reales de tu dominio (blog, talk, work, project)
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

    // 3. Mapa tipado de colecciones (cleanest, single-responsibility)
    const collectionMocks: Record<SectionType, CollectionEntry<SectionType>[]> = {
      blog: mockBlogEntries,
      talk: mockTalkEntries,
      work: [],
      projects: [],
      community: [],
    }

    // 4. Mock de getCollection: lookup type-safe desde el record
    vi.mocked(getCollection).mockImplementation(
      async (collection: SectionType) => collectionMocks[collection]
    )

    // 5. Ejecución del punto de entrada único (Caja Negra)
    const sitemapXml = await generateSitemap()

    // 6. Aserciones sobre el string XML resultante (Garantiza que generateSitemapXml se ejecutó con éxito)
    expect(sitemapXml).toBeTypeOf('string')
    expect(sitemapXml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(sitemapXml).toContain('<urlset')

    // Validamos que las páginas core / estáticas (Home, Acerca de, Tags) se hayan integrado
    expect(sitemapXml).toContain('<loc>/es/</loc>')
    expect(sitemapXml).toContain('<loc>/en/</loc>')
    expect(sitemapXml).toContain('<loc>/es/acerca-de</loc>')
    expect(sitemapXml).toContain('<loc>/en/about</loc>')
    expect(sitemapXml).toContain('<loc>/es/tags</loc>')
    expect(sitemapXml).toContain('<loc>/en/tags</loc>')

    // Validamos que las rutas dinámicas procesadas asimétricamente existan en el output
    expect(sitemapXml).toContain('<loc>/es/blog/intro-python</loc>')
    expect(sitemapXml).toContain('<loc>/en/blog/intro-python</loc>')
    expect(sitemapXml).toContain('<loc>/es/charla/test-unitarios</loc>')
    expect(sitemapXml).toContain('<loc>/en/blog/tags/python</loc>')
    expect(sitemapXml).toContain('<loc>/es/blog/tags/python</loc>')
    expect(sitemapXml).toContain('<loc>/es/charla/tags/pruebas</loc>')


    // Validamos la inyección correcta de hreflang generados por @secorto/i18n en el XML
    expect(sitemapXml).toContain('hreflang="x-default"')
    expect(sitemapXml).toContain('hreflang="es"')
    expect(sitemapXml).toContain('hreflang="en"')

    // Verificamos que el borrador efectivamente se haya quedado fuera del sitemap
    expect(sitemapXml).not.toContain('blog/es/borrador')
  })
})
