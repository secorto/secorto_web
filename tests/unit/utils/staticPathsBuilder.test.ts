import { test, expect, describe, vi } from 'vitest'
import {
  buildAllDetailPathsCore,
  buildSectionIndexPathsCore,
  buildLocalePathsForSection,
  buildTagPathsCore,
  buildTagIndexPathsCore,
  type FetchCollection
} from '@utils/staticPathsBuilder'
import type { CollectionEntry, CollectionKey } from 'astro:content'
import { sectionsConfig, type SectionConfig } from '@domain/section'
import {
  collectionMocks,
  createPostEntries,
  createCollectionEntry,
} from './staticPathsBuilder.fixtures'

const blogSection = sectionsConfig['blog']
const talkSection = sectionsConfig['talk']

describe('buildAllDetailPathsCore', () => {

  test('handles empty collections gracefully', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => [] as CollectionEntry<CollectionKey>[])

    const result = await buildAllDetailPathsCore([blogSection], mockGetCollection)

    expect(result).toEqual([])
  })

  test('generates correct params structure', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => createPostEntries('blog', 2))

    const result = await buildAllDetailPathsCore([blogSection], mockGetCollection)

    expect(result.length).toBeGreaterThan(0)
    for (const path of result) {
      expect(path.params.locale).toBeDefined()
      expect(path.params.section).toBeDefined()
      expect(path.params.id).toBeDefined()
      expect(path.props.entry).toBeDefined()
      expect(path.props.availableLocales).toBeDefined()
      expect(path.props.config).toBeDefined()
    }
  })

  test('properly injects all dependencies', async () => {
    const mockEntries = createPostEntries('blog', 1)
    const mockGetCollection: FetchCollection = vi.fn(async () => mockEntries)

    const result = await buildAllDetailPathsCore([blogSection], mockGetCollection)

    expect(mockGetCollection).toHaveBeenCalled()
    expect(result.length).toBeGreaterThan(0)
  })

  test('lanza error si un entry no está bajo una carpeta de locale válida', async () => {
    const invalidEntry = createCollectionEntry('blog', { id: 'orphan/my-post' })
    const mockGetCollection: FetchCollection = vi.fn(async () => [invalidEntry])

    await expect(buildAllDetailPathsCore([blogSection], mockGetCollection))
      .rejects.toThrow('Unknown locale prefix "orphan" in entryId "orphan/my-post"')
  })
})

describe('buildLocalePathsForSection', () => {
  const postEntries = createPostEntries('blog', 4, { tags: ['ts'] }, 'post')
  const workEntries = createPostEntries('work', 4, {}, 'work')

  test('genera paths para todos los locales configurados', () => {
    const result = buildLocalePathsForSection(blogSection, postEntries)

    expect(result).toHaveLength(2) // es + en
    expect(result.map(p => p.params.locale).sort()).toEqual(['en', 'es'])
  })

  test('rama post: config.category es "post" y posts son PostEntry[]', () => {
    const result = buildLocalePathsForSection(blogSection, postEntries)

    for (const path of result) {
      expect(path.props.config.category).toBe('post')
      expect(Array.isArray(path.props.posts)).toBe(true)
    }
  })

  test('rama experience: config.category es "experience" y posts son ExperienceLikeEntry[]', () => {
    const result = buildLocalePathsForSection(sectionsConfig['work'], workEntries)

    for (const path of result) {
      expect(path.props.config.category).toBe('experience')
      expect(Array.isArray(path.props.posts)).toBe(true)
    }
  })

  test('rama post: filtra entradas por locale correctamente', () => {
    const result = buildLocalePathsForSection(blogSection, postEntries)

    const esPath = result.find(p => p.params.locale === 'es')
    const enPath = result.find(p => p.params.locale === 'en')

    // createMockEntries alterna es/en por índice (0→es, 1→en, 2→es, 3→en)
    expect(esPath?.props.posts).toHaveLength(2)
    expect(enPath?.props.posts).toHaveLength(2)
  })

  test('extrae tags desde los posts del locale correspondiente', () => {
    const result = buildLocalePathsForSection(blogSection, postEntries)

    const esPath = result.find(p => p.params.locale === 'es')
    expect(esPath?.props.tags).toContain('ts')
  })

  test('collection vacía produce arrays de posts y tags vacíos', () => {
    const result = buildLocalePathsForSection(blogSection, [])

    for (const path of result) {
      expect(path.props.posts).toHaveLength(0)
      expect(path.props.tags).toHaveLength(0)
    }
  })
})

describe('buildSectionIndexPathsCore', () => {
  test('builds paths for provided sections and locales', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => [])
    const mockSections = [blogSection, talkSection]

    const result = await buildSectionIndexPathsCore(mockSections, mockGetCollection)

    // 2 sections × 2 locales = 4 paths
    expect(result).toHaveLength(4)
  })

  test('includes correct structure per locale', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => [])
    const mockSections = [blogSection]

    const result = await buildSectionIndexPathsCore(mockSections, mockGetCollection)

    expect(result).toHaveLength(2) // blog × 2 locales

    for (const path of result) {
      expect(path.params.locale).toMatch(/es|en/)
      expect(path.params.section).toBeDefined()
      expect(path.props.config).toBeDefined()
      expect(Array.isArray(path.props.posts)).toBe(true)
      expect(Array.isArray(path.props.tags)).toBe(true)
    }
  })

  test('handles empty sections', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => [])
    const mockSections: SectionConfig[] = []

    const result = await buildSectionIndexPathsCore(mockSections, mockGetCollection)

    expect(result).toEqual([])
  })

  test('extracts tags from posts', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => [
      createPostEntries('blog', 1, { tags: ['typescript', 'testing'] })[0],
      createPostEntries('blog', 1, { id: 'en/post-2', tags: ['testing'] })[0]
    ])
    const mockSections = [blogSection]

    const result = await buildSectionIndexPathsCore(mockSections, mockGetCollection)

    const esPath = result.find(p => p.params.locale === 'es')
    expect(esPath?.props.tags).toContain('typescript')
    expect(esPath?.props.tags).toContain('testing')
  })
})

describe('buildTagPathsCore', () => {
  test('generates tag paths for provided sections', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => [
      createPostEntries('blog', 1, { tags: ['typescript', 'astro'] })[0],
      createPostEntries('blog', 1, { id: 'en/post-1', tags: ['testing'] })[0]
    ])
    const mockSections = [blogSection, talkSection]

    const result = await buildTagPathsCore(mockSections, mockGetCollection)

    // Should have multiple tags across sections and locales
    expect(result.length).toBeGreaterThan(0)
  })

  test('includes tag in params', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => [
      createPostEntries('blog', 1, { tags: ['typescript'] })[0]
    ])
    const mockSections = [blogSection]

    const result = await buildTagPathsCore(mockSections, mockGetCollection)

    for (const path of result) {
      expect(path.params.tag).toBeDefined()
    }
  })

  test('includes allEntries and config in props', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => [
      createPostEntries('blog', 1, { tags: ['typescript'] })[0]
    ])
    const mockSections = [blogSection]

    const result = await buildTagPathsCore(mockSections, mockGetCollection)

    expect(result.length).toBeGreaterThan(0)
    for (const path of result) {
      expect(Array.isArray(path.props.allEntries)).toBe(true)
      expect(path.props.config).toBeDefined()
    }
  })

  test('returns empty when no posts have tags', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => [
      createPostEntries('blog', 1, { tags: [] })[0]
    ])
    const mockSections = [sectionsConfig['blog']]

    const result = await buildTagPathsCore(mockSections, mockGetCollection)

    expect(result).toEqual([])
  })

  test('deduplicates tags within the same locale', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => [
      createPostEntries('blog', 1, { tags: ['astro', 'astro', 'ts'] })[0],
      createPostEntries('blog', 1, { id: 'es/post-2', tags: ['ts'] })[0],
      createPostEntries('blog', 1, { id: 'en/post-1', tags: ['astro', 'astro', 'ts'] })[0],
      createPostEntries('blog', 1, { id: 'en/post-2', tags: ['ts'] })[0]
    ])
    const mockSections = [sectionsConfig['blog']]

    const result = await buildTagPathsCore(mockSections, mockGetCollection)

    // Should not have duplicate tags per locale
    const esTags = result
      .filter(p => p.params.locale === 'es')
      .map(p => p.params.tag)
    const enTags = result
      .filter(p => p.params.locale === 'en')
      .map(p => p.params.tag)

    expect(new Set(esTags).size).toBe(esTags.length)
    expect(new Set(enTags).size).toBe(enTags.length)
  })

  test('handles empty sections', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => [])
    const mockSections: SectionConfig[] = []

    const result = await buildTagPathsCore(mockSections, mockGetCollection)

    expect(result).toEqual([])
  })
})

describe('buildTagIndexPathsCore', () => {
  test('generates one path per locale', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => createPostEntries('blog', 1))
    const mockSections = [sectionsConfig['blog']]

    const result = await buildTagIndexPathsCore(mockSections, mockGetCollection)

    expect(result).toHaveLength(2) // 2 locales (es, en)
  })

  test('includes correct structure with allSectionEntries', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => createPostEntries('blog', 1))
    const mockSections = [sectionsConfig['blog']]

    const result = await buildTagIndexPathsCore(mockSections, mockGetCollection)

    expect(result.length).toBeGreaterThan(0)
    for (const path of result) {
      expect(path.params.locale).toMatch(/es|en/)
      expect(path.props.allSectionEntries).toBeDefined()
      expect(typeof path.props.allSectionEntries).toBe('object')
    }
  })

  test('caches entries by collection', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async (collection: CollectionKey) => {
      const collections: Partial<Record<CollectionKey, CollectionEntry<CollectionKey>[]>> = {
        blog: collectionMocks.blog(2),
        talk: collectionMocks.talk(1)
      }
      return collections[collection] || []
    })
    const mockSections = [sectionsConfig['blog'], sectionsConfig['talk']]

    const result = await buildTagIndexPathsCore(mockSections, mockGetCollection)

    // Each route should have allSectionEntries with both collections
    for (const path of result) {
      expect(path.props.allSectionEntries).toHaveProperty('blog')
      expect(path.props.allSectionEntries).toHaveProperty('talk')
      expect(Array.isArray(path.props.allSectionEntries.blog)).toBe(true)
      expect(Array.isArray(path.props.allSectionEntries.talk)).toBe(true)
    }

    // Verify that getCollection was called once per section (not per locale)
    expect(mockGetCollection).toHaveBeenCalledTimes(2)
  })

  test('handles empty sections gracefully', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => [])
    const mockSections: SectionConfig[] = []

    const result = await buildTagIndexPathsCore(mockSections, mockGetCollection)

    expect(result).toHaveLength(2) // 2 locales, but no collections
    for (const path of result) {
      expect(path.props.allSectionEntries).toEqual({})
    }
  })

  test('properly injects all dependencies', async () => {
    const mockEntries = createPostEntries('blog', 2)
    const mockGetCollection: FetchCollection = vi.fn(async () => mockEntries)

    const result = await buildTagIndexPathsCore([blogSection], mockGetCollection)

    expect(mockGetCollection).toHaveBeenCalled()
    expect(result.length).toBeGreaterThan(0)
  })
})
