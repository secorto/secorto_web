import type { CollectionEntry, CollectionKey } from 'astro:content'
import type { SectionConfig, SectionType } from '@domain/section'

/**
 * Factory para crear datos de prueba realistas que coincidan con el schema de Astro.
 * Evita repetir structs complejos y centraliza cambios en el schema.
 */

export interface MockEntryOptions {
  collection?: CollectionKey
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
 * La colección debe especificarse explícitamente para evitar inconsistencias con datos reales.
 */
export function createMockEntry(
  collection: CollectionKey,
  options: Omit<MockEntryOptions, 'collection'> = {}
): CollectionEntry<CollectionKey> {
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
    collection,
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
 * Todas las entradas comparten la misma colección especificada explícitamente.
 */
export function createMockEntries(
  collection: CollectionKey,
  count: number,
  baseOptions: Omit<MockEntryOptions, 'collection'> = {},
  idPrefix = 'entry'
): CollectionEntry<CollectionKey>[] {
  return Array.from({ length: count }, (_, i) => {
    const locale = i % 2 === 0 ? 'es' : 'en'
    const id = `${locale}/${idPrefix}-${i + 1}`
    return createMockEntry(collection, {
      ...baseOptions,
      id
    })
  })
}

/**
 * Factory para crear mocks de colecciones completas por tipo.
 * Facilita crear escenarios realistas en los tests.
 * Cada factory especifica explícitamente su collection.
 */
export const collectionMocks = {
  blog: (count = 2): CollectionEntry<CollectionKey>[] =>
    createMockEntries('blog', count, { title: 'Blog Post' }, 'blog-post'),

  talk: (count = 2): CollectionEntry<CollectionKey>[] =>
    createMockEntries('talk', count, { title: 'Talk' }, 'talk'),

  work: (count = 2): CollectionEntry<CollectionKey>[] =>
    createMockEntries('work', count, { title: 'Work' }, 'work'),

  projects: (count = 2): CollectionEntry<CollectionKey>[] =>
    createMockEntries('projects', count, { title: 'Project' }, 'project'),

  community: (): CollectionEntry<CollectionKey>[] =>
    createMockEntries('community', 0)
}

/**
 * Crea una SectionConfig mock mínima para testing.
 * Útil para pasar como parte de mock sections array.
 */
export function createMockSectionConfig(
  key: SectionType,
  overrides: Partial<SectionConfig> = {}
): SectionConfig {
  return {
    name: key,
    category: 'post',
    translationKey: 'nav.blog',
    routes: { es: key, en: key },
    showFeaturedImage: true,
    ...overrides
  }
}

/**
 * Crea un array de mock sections para testing.
 * Permite crear configuraciones mínimas sin depender de sectionsConfig global.
 */
export function createMockSectionsArray(
  sectionKeys: SectionType[],
  baseOverrides: Partial<SectionConfig> = {}
): SectionConfig[] {
  return sectionKeys.map(key => createMockSectionConfig(key, baseOverrides))
}
