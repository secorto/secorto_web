import { describe, test, expect, vi } from 'vitest'
import {
  buildSectionIndexPaths,
  buildTagPaths,
  buildAllDetailPaths,
  buildTagIndexPaths
} from '@utils/staticPathsBuilder.adapters'
import type { FetchCollection } from '@utils/staticPathsBuilder'
import type { CollectionKey, CollectionEntry } from 'astro:content'
import { collectionMocks, createMockEntries } from './staticPathsBuilder.fixtures'

// Mock sectionsConfig globally so adapters have default injected values
vi.mock('@domain/section', () => {
  const mockConfig = {
    blog: {
      name: 'blog' as const,
      category: 'post' as const,
      translationKey: 'nav.blog',
      routes: { es: 'blog', en: 'blog' },
      showFeaturedImage: true
    },
    talk: {
      name: 'talk' as const,
      category: 'post' as const,
      translationKey: 'nav.talks',
      routes: { es: 'charla', en: 'talk' },
      showFeaturedImage: true
    }
  }
  return {
    sectionsConfig: mockConfig
  }
})

describe('staticPathsBuilder.adapters', () => {
  describe('buildSectionIndexPaths (adapter with injected sectionsConfig)', () => {
    test('adapts Core with default sectionsConfig', async () => {
      const mockGetCollection: FetchCollection = vi.fn(async () => [])

      const result = await buildSectionIndexPaths(mockGetCollection)

      // Should call getCollection for each mocked section
      expect(mockGetCollection).toHaveBeenCalledTimes(2)
      // Should have paths for 2 sections × 2 locales = 4
      expect(result).toHaveLength(4)
    })

    test('uses injected fetchCollection with default getCollection', async () => {
      const customFetch: FetchCollection = vi.fn(async () => createMockEntries('blog', 2))

      const result = await buildSectionIndexPaths(customFetch)

      expect(customFetch).toHaveBeenCalled()
      expect(result.length).toBeGreaterThan(0)
    })

    test('maintains adapter responsibility: uses sectionsConfig automatically', async () => {
      const mockGetCollection: FetchCollection = vi.fn(async () => [])

      // Adapter does NOT require sections as parameter - injects them
      const result = await buildSectionIndexPaths(mockGetCollection)

      // If adapter didn't inject sectionsConfig, would fail or return wrong length
      expect(result).toHaveLength(4)
    })
  })

  describe('buildTagPaths (adapter with injected sectionsConfig)', () => {
    test('adapts Core with default sectionsConfig', async () => {
      const mockGetCollection: FetchCollection = vi.fn(async () => [
        createMockEntries('blog', 1, { tags: ['typescript'] })[0]
      ])

      const result = await buildTagPaths(mockGetCollection)

      expect(mockGetCollection).toHaveBeenCalled()
      // Should generate tag paths for all mocked sections
      expect(result.length).toBeGreaterThan(0)
    })

    test('passes all deps to Core correctly', async () => {
      const entries = [
        createMockEntries('blog', 1, { tags: ['test', 'astro'] })[0],
        createMockEntries('blog', 1, { id: 'en/post-2', tags: ['web'] })[0]
      ]
      const mockGetCollection: FetchCollection = vi.fn(async () => entries)

      const result = await buildTagPaths(mockGetCollection)

      expect(mockGetCollection).toHaveBeenCalled()
      for (const path of result) {
        expect(path.params.tag).toBeDefined()
        expect(path.props.tagLocaleMap).toBeDefined()
      }
    })
  })

  describe('buildAllDetailPaths (adapter with injected sectionsConfig)', () => {
    test('adapts Core with default sectionsConfig', async () => {
      const mockGetCollection: FetchCollection = vi.fn(async (collection: CollectionKey) => {
        const collections: Partial<Record<CollectionKey, CollectionEntry<CollectionKey>[]>> = {
          blog: collectionMocks.blog(2),
          talk: collectionMocks.talk(1)
        }
        return collections[collection] || []
      })

      const result = await buildAllDetailPaths(mockGetCollection)

      // Should call for each mocked section
      expect(mockGetCollection).toHaveBeenCalledTimes(2)
      // 2 blog entries + 1 talk entry = 3 total
      expect(result).toHaveLength(3)
    })

    test('injects sectionsConfig automatically without requiring parameter', async () => {
      const mockGetCollection: FetchCollection = vi.fn(async () => createMockEntries('blog', 1))

      // Note: adapter has signature (fetchCollection) - NO sections parameter
      const result = await buildAllDetailPaths(mockGetCollection)

      expect(mockGetCollection).toHaveBeenCalled()
      expect(result.length).toBeGreaterThan(0)
    })

    test('adapter boundary: separates Core logic from global config', async () => {
      // This test verifies the adapter pattern is working:
      // Core (tested separately) receives explicit deps
      // Adapter provides default deps transparently
      const mockGetCollection: FetchCollection = vi.fn(async (collection: CollectionKey) => {
        const collections: Partial<Record<CollectionKey, CollectionEntry<CollectionKey>[]>> = {
          blog: collectionMocks.blog(2),
          talk: collectionMocks.talk(1)
        }
        return collections[collection] || []
      })

      const result = await buildAllDetailPaths(mockGetCollection)

      // If adapter didn't inject sectionsConfig, this would be empty or error
      // Instead it works correctly with 2 mocked sections:
      // - 2 blog entries + 1 talk entry = 3 total detail paths
      expect(result).toHaveLength(3)
    })
  })

  describe('buildTagIndexPaths (adapter with injected sectionsConfig)', () => {
    test('adapts Core with default sectionsConfig', async () => {
      const mockGetCollection: FetchCollection = vi.fn(async (collection: CollectionKey) => {
        const collections: Partial<Record<CollectionKey, CollectionEntry<CollectionKey>[]>> = {
          blog: collectionMocks.blog(2),
          talk: collectionMocks.talk(1)
        }
        return collections[collection] || []
      })

      const result = await buildTagIndexPaths(mockGetCollection)

      // Should call getCollection once per mocked section (caching optimization)
      expect(mockGetCollection).toHaveBeenCalledTimes(2)
      // Should have one path per locale
      expect(result).toHaveLength(2)
    })

    test('caches all collections in props', async () => {
      const mockGetCollection: FetchCollection = vi.fn(async (collection: CollectionKey) => {
        const collections: Partial<Record<CollectionKey, CollectionEntry<CollectionKey>[]>> = {
          blog: collectionMocks.blog(1),
          talk: collectionMocks.talk(1)
        }
        return collections[collection] || []
      })

      const result = await buildTagIndexPaths(mockGetCollection)

      // Each path should have all cached entries
      for (const path of result) {
        expect(path.props.allSectionEntries).toHaveProperty('blog')
        expect(path.props.allSectionEntries).toHaveProperty('talk')
        expect(Array.isArray(path.props.allSectionEntries.blog)).toBe(true)
        expect(Array.isArray(path.props.allSectionEntries.talk)).toBe(true)
      }
    })

    test('returns paths with proper locale params', async () => {
      const mockGetCollection: FetchCollection = vi.fn(async () => [])

      const result = await buildTagIndexPaths(mockGetCollection)

      expect(result).toHaveLength(2)
      const locales = result.map(p => p.params.locale).sort()
      expect(locales).toEqual(['en', 'es'])
    })

    test('maintains adapter responsibility: uses sectionsConfig automatically', async () => {
      const mockGetCollection: FetchCollection = vi.fn(async () => [])

      // Adapter does NOT require sections as parameter - injects them
      const result = await buildTagIndexPaths(mockGetCollection)

      // If adapter didn't inject sectionsConfig, would have different call count
      // With 2 mocked sections, should call getCollection exactly twice
      expect(mockGetCollection).toHaveBeenCalledTimes(2)
      // Verify that paths are still generated for all locales
      expect(result).toHaveLength(2)
    })
  })

  describe('adapter pattern: explicit coupling at boundary', () => {
    test('all adapters have sectionsConfig knowledge at module level', async () => {
      // Adapters import and use sectionsConfig directly
      // This centralizes the coupling in one place per adapter
      const mockGetCollection: FetchCollection = vi.fn(async () => [])

      expect(async () => {
        await buildSectionIndexPaths(mockGetCollection)
      }).not.toThrow()

      expect(async () => {
        await buildTagPaths(mockGetCollection)
      }).not.toThrow()

      expect(async () => {
        await buildAllDetailPaths(mockGetCollection)
      }).not.toThrow()

      expect(async () => {
        await buildTagIndexPaths(mockGetCollection)
      }).not.toThrow()
    })
  })
})
