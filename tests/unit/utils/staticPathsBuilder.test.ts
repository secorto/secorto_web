import { test, expect, describe, vi } from 'vitest'
import {
  buildDetailPathsForSection,
  buildAllDetailPaths,
  buildSectionIndexPaths,
  buildTagPaths
} from '@utils/staticPathsBuilder'
import type { SectionConfig } from '@config/sections'
import type { CollectionEntry, CollectionKey } from 'astro:content'

describe('buildDetailPathsForSection', () => {
  const mockConfig: SectionConfig = {
    collection: 'blog',
    translationKey: 'nav.blog',
    hasTags: true,
    taggedKey: 'blog.tagged',
    routes: {
      es: 'blog',
      en: 'blog'
    },
    listComponent: 'ListPost',
    detailComponent: 'BlogTalkPostView',
    showFeaturedImage: true
  }

  test('builds paths for entries with slug in data', () => {
    const entries = [
      {
        id: 'es/2025-01-22-my-post',
        data: { slug: 'custom-slug', title: 'Test' }
      },
      {
        id: 'en/2025-01-22-my-post',
        data: { slug: 'custom-slug', title: 'Test' }
      }
    ]

    const result = buildDetailPathsForSection(entries, mockConfig)

    expect(result).toHaveLength(2)
    expect(result).toContainEqual({
      params: {
        locale: 'es',
        section: 'blog',
        id: 'custom-slug'
      }
    })
    expect(result).toContainEqual({
      params: {
        locale: 'en',
        section: 'blog',
        id: 'custom-slug'
      }
    })
  })

  test('builds paths using file ID when no slug provided', () => {
    const entries = [
      {
        id: 'es/2025-01-22-my-post',
        data: { title: 'Test Post' }
      }
    ]

    const result = buildDetailPathsForSection(entries, mockConfig)

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      params: {
        locale: 'es',
        section: 'blog',
        id: '2025-01-22-my-post'
      }
    })
  })

  test('filters entries by locale prefix correctly', () => {
    const entries = [
      {
        id: 'es/post-1',
        data: { title: 'Post 1' }
      },
      {
        id: 'en/post-2',
        data: { title: 'Post 2' }
      },
      {
        id: 'es/post-3',
        data: { title: 'Post 3' }
      }
    ]

    const result = buildDetailPathsForSection(entries, mockConfig, ['es'])

    expect(result).toHaveLength(2)
    expect(result.every(p => p.params.locale === 'es')).toBe(true)
  })

  test('handles section with different routes per locale', () => {
    const talkConfig: SectionConfig = {
      collection: 'talk',
      translationKey: 'nav.talks',
      hasTags: true,
      taggedKey: 'talk.tagged',
      routes: {
        es: 'charla',
        en: 'talk'
      },
      listComponent: 'ListPost',
      detailComponent: 'BlogTalkPostView',
      showFeaturedImage: true
    }

    const entries = [
      {
        id: 'es/my-talk',
        data: { title: 'Mi Charla' }
      },
      {
        id: 'en/my-talk',
        data: { title: 'My Talk' }
      }
    ]

    const result = buildDetailPathsForSection(entries, talkConfig)

    expect(result).toHaveLength(2)
    expect(result.find(p => p.params.locale === 'es')?.params.section).toBe('charla')
    expect(result.find(p => p.params.locale === 'en')?.params.section).toBe('talk')
  })

  test('handles empty entries array', () => {
    const result = buildDetailPathsForSection([], mockConfig)
    expect(result).toEqual([])
  })

  test('handles entries with nested paths', () => {
    const entries = [
      {
        id: 'es/category/subcategory/2025-01-22-post',
        data: { title: 'Nested Post' }
      }
    ]

    const result = buildDetailPathsForSection(entries, mockConfig)

    expect(result).toHaveLength(1)
    expect(result[0].params.id).toBe('category/subcategory/2025-01-22-post')
  })

  test('prefers slug over file ID when both exist', () => {
    const entries = [
      {
        id: 'es/2025-01-22-long-file-name',
        data: { slug: 'short-slug', title: 'Test' }
      }
    ]

    const result = buildDetailPathsForSection(entries, mockConfig)

    expect(result[0].params.id).toBe('short-slug')
  })
})

describe('buildAllDetailPaths', () => {
  test('combines paths from all sections', async () => {
    const mockGetCollection = vi.fn(async (collection: CollectionKey) => {
      if (collection === 'blog') {
        return [
          { id: 'es/blog-post-1', data: { title: 'Blog 1' } },
          { id: 'en/blog-post-1', data: { title: 'Blog 1' } }
        ] as CollectionEntry<'blog'>[]
      }
      if (collection === 'talk') {
        return [
          { id: 'es/talk-1', data: { title: 'Talk 1' } }
        ] as CollectionEntry<'talk'>[]
      }
      if (collection === 'work') {
        return [
          { id: 'es/work-1', data: { title: 'Work 1' } }
        ] as CollectionEntry<'work'>[]
      }
      if (collection === 'projects') {
        return [
          { id: 'en/project-1', data: { title: 'Project 1' } }
        ] as CollectionEntry<'projects'>[]
      }
      if (collection === 'community') {
        return [] as CollectionEntry<'community'>[]
      }
      return []
    })

    const result = await buildAllDetailPaths(mockGetCollection as never)

    // Should have paths from blog (2), talk (1), work (1), projects (1) = 5 total
    expect(result.length).toBeGreaterThanOrEqual(5)
    expect(mockGetCollection).toHaveBeenCalled()
  })

  test('handles empty collections gracefully', async () => {
    const mockGetCollection = vi.fn(async () => [])

    const result = await buildAllDetailPaths(mockGetCollection as never)

    expect(result).toEqual([])
  })

  test('calls getCollection for each section configuration', async () => {
    const mockGetCollection = vi.fn(async () => [])

    await buildAllDetailPaths(mockGetCollection as never)

    // Should be called once per section (blog, talk, work, projects, community)
    expect(mockGetCollection).toHaveBeenCalledTimes(5)
  })

  test('properly injects getCollection dependency', async () => {
    const mockEntries = [
      { id: 'es/test', data: { title: 'Test' } }
    ]
    const mockGetCollection = vi.fn(async () => mockEntries)

    const result = await buildAllDetailPaths(mockGetCollection as never)

    expect(mockGetCollection).toHaveBeenCalled()
    expect(result.length).toBeGreaterThan(0)
  })
})

describe('buildSectionIndexPaths', () => {
  test('builds paths for all sections and locales', async () => {
    const result = await buildSectionIndexPaths()

    // Should have paths for each section × 2 locales (es, en)
    // 5 sections (blog, talk, work, projects, community) × 2 locales = 10
    expect(result).toHaveLength(10)
  })

  test('includes correct section routes per locale', async () => {
    const result = await buildSectionIndexPaths()

    const blogEsPath = result.find(p => p.params.locale === 'es' && p.params.section === 'blog')
    const talkEsPath = result.find(p => p.params.locale === 'es' && p.params.section === 'charla')
    const talkEnPath = result.find(p => p.params.locale === 'en' && p.params.section === 'talk')

    expect(blogEsPath).toBeDefined()
    expect(talkEsPath).toBeDefined()
    expect(talkEnPath).toBeDefined()
  })
})

describe('buildTagPaths', () => {
  test('only builds paths for sections with tags enabled', async () => {
    const result = await buildTagPaths()

    // Only blog and talk have tags enabled
    const sections = [...new Set(result.map(p => p.params.section))]
    expect(sections).not.toContain('trabajo') // work section
    expect(sections).not.toContain('work')
  })

  test('includes tag in both params and props', async () => {
    const result = await buildTagPaths()

    if (result.length > 0) {
      const firstPath = result[0]
      expect(firstPath.params.tag).toBeDefined()
      expect(firstPath.props.tag).toBeDefined()
      expect(firstPath.params.tag).toBe(firstPath.props.tag)
    }
  })
})
