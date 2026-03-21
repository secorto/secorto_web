import { describe, test, expect, vi } from 'vitest'
import {
  buildSectionIndexPaths,
  buildTagPaths,
  buildAllDetailPaths
} from '@utils/staticPathsBuilder.adapters'
import type { FetchCollection } from '@utils/staticPathsBuilder'
import type { CollectionKey, CollectionEntry } from 'astro:content'
import { collectionMocks, createMockEntries } from './staticPathsBuilder.fixtures'

// Mock sectionsConfig globally so adapters have default injected values
vi.mock('@domain/section', () => {
  const mockConfig = {
    blog: {
      collection: 'blog' as CollectionKey,
      translationKey: 'nav.blog',
      routes: { es: 'blog', en: 'blog' },
      listComponent: 'ListPost',
      detailComponent: 'BlogTalkPostView',
      showFeaturedImage: true
    },
    talk: {
      collection: 'talk' as CollectionKey,
      translationKey: 'nav.talks',
      routes: { es: 'charla', en: 'talk' },
      listComponent: 'ListPost',
      detailComponent: 'BlogTalkPostView',
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
      const customFetch: FetchCollection = vi.fn(async () => createMockEntries(2))

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
        createMockEntries(1, { tags: ['typescript'] })[0]
      ])

      const result = await buildTagPaths(mockGetCollection)

      expect(mockGetCollection).toHaveBeenCalled()
      // Should generate tag paths for all mocked sections
      expect(result.length).toBeGreaterThan(0)
    })

    test('passes all deps to Core correctly', async () => {
      const entries = [
        createMockEntries(1, { tags: ['test', 'astro'] })[0],
        createMockEntries(1, { id: 'en/post-2', tags: ['web'] })[0]
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
      const mockGetCollection: FetchCollection = vi.fn(async () => createMockEntries(1))

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
    })
  })
})
