import type { CollectionEntry, CollectionKey } from 'astro:content'
import type { SectionConfig } from '@domain/section'

/**
 * Factory para crear datos de prueba realistas que coincidan con el schema de Astro.
 * Evita repetir structs complejos y centraliza cambios en el schema.
 */

export interface MockEntryOptions {
  id?: string
  title?: string
  date?: Date
  excerpt?: string
  tags?: string[]
  draft?: boolean
}

/**
 * Crea una entrada de colección mínima válida con los campos esperados.
 * Proporciona valores por defecto realistas para campos requeridos.
 */
export function createMockEntry(options: MockEntryOptions = {}): CollectionEntry<CollectionKey> {
  const {
    id = 'es/test-entry',
    title = 'Test Entry',
    date = new Date('2024-01-01'),
    excerpt = 'Test excerpt',
    tags = [],
    draft = false
  } = options

  return {
    id,
    collection: 'blog' as CollectionKey,
    data: {
      title,
      date,
      excerpt,
      tags,
      draft,
      // Campos opcionales que puede tener el schema
      image: undefined,
      description: undefined,
      postId: undefined,
      canonical: undefined,
      change_log: undefined
    },
    body: '',
    render: async () => ({ Content: () => null, headings: [], remarkPluginFrontmatter: {} })
  } as unknown as CollectionEntry<CollectionKey>
}

/**
 * Crea múltiples entradas para una colección.
 */
export function createMockEntries(
  count: number,
  baseOptions: MockEntryOptions = {},
  idPrefix = 'entry'
): CollectionEntry<CollectionKey>[] {
  return Array.from({ length: count }, (_, i) => {
    const locale = i % 2 === 0 ? 'es' : 'en'
    return createMockEntry({
      ...baseOptions,
      id: `${locale}/${idPrefix}-${i + 1}`
    })
  })
}

/**
 * Factory para crear mocks de colecciones completas por tipo.
 * Facilita crear escenarios realistas en los tests.
 */
export const collectionMocks = {
  blog: (count = 2): CollectionEntry<CollectionKey>[] =>
    createMockEntries(count, { title: 'Blog Post' }, 'blog-post'),

  talk: (count = 2): CollectionEntry<CollectionKey>[] =>
    createMockEntries(count, { title: 'Talk' }, 'talk'),

  work: (count = 2): CollectionEntry<CollectionKey>[] =>
    createMockEntries(count, { title: 'Work' }, 'work'),

  projects: (count = 2): CollectionEntry<CollectionKey>[] =>
    createMockEntries(count, { title: 'Project' }, 'project'),

  community: (): CollectionEntry<CollectionKey>[] => []
}

/**
 * Crea una SectionConfig mock mínima para testing.
 * Útil para pasar como parte de mock sections array.
 */
export function createMockSectionConfig(
  key: string,
  overrides: Partial<SectionConfig> = {}
): SectionConfig {
  return {
    collection: key as CollectionKey,
    translationKey: 'nav.blog',
    routes: { es: key, en: key },
    listComponent: 'ListPost',
    detailComponent: 'BlogTalkPostView',
    showFeaturedImage: true,
    ...overrides
  }
}

/**
 * Crea un array de mock sections para testing.
 * Permite crear configuraciones mínimas sin depender de sectionsConfig global.
 */
export function createMockSectionsArray(
  sectionKeys: string[],
  baseOverrides: Partial<SectionConfig> = {}
): SectionConfig[] {
  return sectionKeys.map(key => createMockSectionConfig(key, baseOverrides))
}
