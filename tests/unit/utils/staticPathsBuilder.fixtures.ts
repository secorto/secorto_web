import type { CollectionEntry, CollectionKey } from 'astro:content'
import type { PostEntry } from '@domain/post'
import { adaptToDomainEntry } from '@utils/entryAdapter'

/**
 * Crea un PostEntry (domain type) directamente para tests.
 * Evita tener que adaptar CollectionEntry a PostEntry en cada test.
 */
type PostFixtureOptions = {
  id?: string
  title?: string
  date?: Date
  excerpt?: string
  tags?: string[]
  draft?: boolean
  postId?: string
}

export function createPostEntry(
  collection: CollectionKey,
  options: PostFixtureOptions = {}
): PostEntry<CollectionKey> {
  const entry = createCollectionEntry(collection, options)
  return adaptToDomainEntry(entry)
}

export function createPostEntries(
  collection: CollectionKey,
  count: number,
  baseOptions: PostFixtureOptions = {},
  idPrefix = 'entry'
): PostEntry<CollectionKey>[] {
  return Array.from({ length: count }, (_, i) => {
    const locale = i % 2 === 0 ? 'es' : 'en'
    const id = `${locale}/${idPrefix}-${i + 1}`
    return createPostEntry(collection, { ...baseOptions, id })
  })
}

/**
 * Crea una `CollectionEntry` mínima (sin conversión a domain) — útil cuando
 * el test necesita que la validación suceda en el código bajo prueba.
 */
export function createCollectionEntry(
  collection: CollectionKey,
  options: PostFixtureOptions = {}
): CollectionEntry<CollectionKey> {
  const {
    id = 'es/test-entry',
    title = 'Test Entry',
    date = new Date('2024-01-01'),
    excerpt = 'Test excerpt',
    tags = [],
    draft = false,
    postId: explicitPostId
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
      image: undefined,
      description: undefined,
      postId: explicitPostId,
      canonical: undefined,
      change_log: undefined
    },
    body: '',
    render: async () => ({ Content: () => null, headings: [], remarkPluginFrontmatter: {} })
  } as unknown as CollectionEntry<CollectionKey>
}
