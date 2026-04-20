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
const onlyBlogSections = [blogSection]
const blogAndTalkSections = [blogSection, talkSection]
const emptySections: SectionConfig[] = []

describe('buildAllDetailPathsCore', () => {
  test('handles empty collections gracefully', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => [] as CollectionEntry<CollectionKey>[])
    const result = await buildAllDetailPathsCore(onlyBlogSections, mockGetCollection)
    expect(result).toEqual([])
  })

  test('lanza error si un entry no está bajo una carpeta de locale válida', async () => {
    const invalidEntry = createCollectionEntry('blog', { id: 'orphan/my-post' })
    const mockGetCollection: FetchCollection = vi.fn(async () => [invalidEntry])
    await expect(buildAllDetailPathsCore(onlyBlogSections, mockGetCollection))
      .rejects.toThrow('Unknown locale prefix "orphan" in entryId "orphan/my-post"')
  })
})

describe('buildLocalePathsForSection', () => {
  const postEntries = createPostEntries('blog', 4, { tags: ['ts'] }, 'post')

  test('rama post: filtra entradas por locale correctamente', () => {
    const result = buildLocalePathsForSection(blogSection, postEntries)
    const esPath = result.find(p => p.params.locale === 'es')
    const enPath = result.find(p => p.params.locale === 'en')
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
  test('handles empty sections', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => [])
    const result = await buildSectionIndexPathsCore(emptySections, mockGetCollection)
    expect(result).toEqual([])
  })

  test('extracts tags from posts', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => [
      createPostEntries('blog', 1, { tags: ['typescript', 'testing'] })[0],
      createPostEntries('blog', 1, { id: 'en/post-2', tags: ['testing'] })[0]
    ])
    const result = await buildSectionIndexPathsCore(onlyBlogSections, mockGetCollection)
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

    const result = await buildTagPathsCore(blogAndTalkSections, mockGetCollection)

    // Should have multiple tags across sections and locales
    expect(result.length).toBeGreaterThan(0)
  })

  test('includes tag in params', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => [
      createPostEntries('blog', 1, { tags: ['typescript'] })[0]
    ])
    const result = await buildTagPathsCore(onlyBlogSections, mockGetCollection)
    for (const path of result) {
      expect(path.params.tag).toBeDefined()
    }
  })

  test('includes allEntries and config in props', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => [
      createPostEntries('blog', 1, { tags: ['typescript'] })[0]
    ])

    const result = await buildTagPathsCore(onlyBlogSections, mockGetCollection)
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
    const result = await buildTagPathsCore(onlyBlogSections, mockGetCollection)
    expect(result).toEqual([])
  })

  test('handles empty sections', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => [])
    const result = await buildTagPathsCore(emptySections, mockGetCollection)
    expect(result).toEqual([])
  })
})

describe('buildTagIndexPathsCore', () => {
  test('generates one path per locale', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => createPostEntries('blog', 1))
    const result = await buildTagIndexPathsCore(onlyBlogSections, mockGetCollection)
    expect(result).toHaveLength(2) // 2 locales (es, en)
  })

  test('includes correct structure with allSectionEntries', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => createPostEntries('blog', 1))
    const result = await buildTagIndexPathsCore(onlyBlogSections, mockGetCollection)
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
    const result = await buildTagIndexPathsCore(blogAndTalkSections, mockGetCollection)
    // Each route should have allSectionEntries with both collections
    for (const path of result) {
      expect(path.props.allSectionEntries).toHaveProperty('blog')
      expect(path.props.allSectionEntries).toHaveProperty('talk')
      expect(Array.isArray(path.props.allSectionEntries.blog)).toBe(true)
      expect(Array.isArray(path.props.allSectionEntries.talk)).toBe(true)
    }
    expect(mockGetCollection).toHaveBeenCalledTimes(2)
  })

  test('handles empty sections gracefully', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => [])
    const result = await buildTagIndexPathsCore(emptySections, mockGetCollection)
    expect(result).toHaveLength(2) // 2 locales, but no collections
    for (const path of result) {
      expect(path.props.allSectionEntries).toEqual({})
    }
  })
})
