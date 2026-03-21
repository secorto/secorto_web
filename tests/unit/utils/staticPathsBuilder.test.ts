import { test, expect, describe, vi } from 'vitest'
import {
  buildAllDetailPathsCore,
  buildSectionIndexPathsCore,
  buildTagPathsCore,
  type FetchCollection
} from '@utils/staticPathsBuilder'
import type { CollectionEntry, CollectionKey } from 'astro:content'
import type { SectionConfig } from '@domain/section'
import {
  collectionMocks,
  createMockEntries,
  createMockSectionsArray
} from './staticPathsBuilder.fixtures'

describe('buildAllDetailPathsCore', () => {
  test('combines paths from provided sections', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async (collection: CollectionKey) => {
      const collections = {
        blog: collectionMocks.blog(2),
        talk: collectionMocks.talk(2)
      } as Record<CollectionKey, CollectionEntry<CollectionKey>[]>
      return collections[collection] || []
    })

    const mockSections = createMockSectionsArray(['blog', 'talk'])
    const result = await buildAllDetailPathsCore(mockSections, mockGetCollection)

    // blog (2) + talk (2) = 4 paths
    expect(result).toHaveLength(4)

    // Verify sections were fetched
    expect(mockGetCollection).toHaveBeenCalledTimes(2)
    expect(mockGetCollection).toHaveBeenCalledWith('blog')
    expect(mockGetCollection).toHaveBeenCalledWith('talk')
  })

  test('handles empty collections gracefully', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => [] as CollectionEntry<CollectionKey>[])
    const mockSections = createMockSectionsArray(['blog'])

    const result = await buildAllDetailPathsCore(mockSections, mockGetCollection)

    expect(result).toEqual([])
  })

  test('generates correct params structure', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => createMockEntries(2))
    const mockSections = createMockSectionsArray(['blog'])

    const result = await buildAllDetailPathsCore(mockSections, mockGetCollection)

    expect(result.length).toBeGreaterThan(0)
    for (const path of result) {
      expect(path.params.locale).toBeDefined()
      expect(path.params.section).toBeDefined()
      expect(path.params.id).toBeDefined()
      expect(path.props.entry).toBeDefined()
      expect(path.props.allEntries).toBeDefined()
      expect(path.props.config).toBeDefined()
    }
  })

  test('properly injects all dependencies', async () => {
    const mockEntries = createMockEntries(1)
    const mockGetCollection: FetchCollection = vi.fn(async () => mockEntries)
    const mockSections = createMockSectionsArray(['blog'])

    const result = await buildAllDetailPathsCore(mockSections, mockGetCollection)

    expect(mockGetCollection).toHaveBeenCalled()
    expect(result.length).toBeGreaterThan(0)
  })
})

describe('buildSectionIndexPathsCore', () => {
  test('builds paths for provided sections and locales', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => [])
    const mockSections = createMockSectionsArray(['blog', 'talk'])

    const result = await buildSectionIndexPathsCore(mockSections, mockGetCollection)

    // 2 sections × 2 locales = 4 paths
    expect(result).toHaveLength(4)
  })

  test('includes correct structure per locale', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => [])
    const mockSections = createMockSectionsArray(['blog'])

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
      createMockEntries(1, { tags: ['typescript', 'testing'] })[0],
      createMockEntries(1, { id: 'en/post-2', tags: ['testing'] })[0]
    ])
    const mockSections = createMockSectionsArray(['blog'])

    const result = await buildSectionIndexPathsCore(mockSections, mockGetCollection)

    const esPath = result.find(p => p.params.locale === 'es')
    expect(esPath?.props.tags).toContain('typescript')
    expect(esPath?.props.tags).toContain('testing')
  })
})

describe('buildTagPathsCore', () => {
  test('generates tag paths for provided sections', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => [
      createMockEntries(1, { tags: ['typescript', 'astro'] })[0],
      createMockEntries(1, { id: 'en/post-1', tags: ['testing'] })[0]
    ])
    const mockSections = createMockSectionsArray(['blog', 'talk'])

    const result = await buildTagPathsCore(mockSections, mockGetCollection)

    // Should have multiple tags across sections and locales
    expect(result.length).toBeGreaterThan(0)
  })

  test('includes tag in both params and props', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => [
      createMockEntries(1, { tags: ['typescript'] })[0]
    ])
    const mockSections = createMockSectionsArray(['blog'])

    const result = await buildTagPathsCore(mockSections, mockGetCollection)

    for (const path of result) {
      expect(path.params.tag).toBeDefined()
      expect(path.props.tag).toBeDefined()
      expect(path.params.tag).toBe(path.props.tag)
    }
  })

  test('includes allEntries and config in props', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => [
      createMockEntries(1, { tags: ['typescript'] })[0]
    ])
    const mockSections = createMockSectionsArray(['blog'])

    const result = await buildTagPathsCore(mockSections, mockGetCollection)

    expect(result.length).toBeGreaterThan(0)
    for (const path of result) {
      expect(Array.isArray(path.props.allEntries)).toBe(true)
      expect(path.props.config).toBeDefined()
      expect(path.props.tagLocaleMap).toBeDefined()
    }
  })

  test('returns empty when no posts have tags', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => [
      createMockEntries(1, { tags: [] })[0]
    ])
    const mockSections = createMockSectionsArray(['blog'])

    const result = await buildTagPathsCore(mockSections, mockGetCollection)

    expect(result).toEqual([])
  })

  test('deduplicates tags within the same locale', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => [
      createMockEntries(1, { tags: ['astro', 'astro', 'ts'] })[0],
      createMockEntries(1, { id: 'es/post-2', tags: ['ts'] })[0],
      createMockEntries(1, { id: 'en/post-1', tags: ['astro', 'astro', 'ts'] })[0],
      createMockEntries(1, { id: 'en/post-2', tags: ['ts'] })[0]
    ])
    const mockSections = createMockSectionsArray(['blog'])

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
