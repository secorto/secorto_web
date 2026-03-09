import { test, expect, describe, vi } from 'vitest'
import {
  buildDetailPathsForSection,
  buildAllDetailPaths,
  buildSectionIndexPaths,
  buildTagPaths,
  type FetchCollection
} from '@utils/staticPathsBuilder'
import type { SectionConfig } from '@domain/section'
import type { CollectionEntry, CollectionKey } from 'astro:content'

describe('buildDetailPathsForSection', () => {
  const mockConfig: SectionConfig = {
    collection: 'blog',
    translationKey: 'nav.blog',
    taggedKey: 'blog.tagged',
    routes: {
      es: 'blog',
      en: 'blog'
    },
    listComponent: 'ListPost',
    detailComponent: 'BlogTalkPostView',
    showFeaturedImage: true
  }


  test('builds paths using file ID when no slug provided', () => {
    const entries = [
      {
        id: 'es/2025-01-22-my-post',
        data: { title: 'Test Post' }
      }
    ]

    const result = buildDetailPathsForSection(entries as CollectionEntry<'blog'>[], mockConfig.routes)

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

    const result = buildDetailPathsForSection(entries as CollectionEntry<'blog'>[], mockConfig.routes, ['es'])

    expect(result).toHaveLength(2)
    expect(result.every(p => p.params.locale === 'es')).toBe(true)
  })

  test('handles section with different routes per locale', () => {
    const talkConfig: SectionConfig = {
      collection: 'talk',
      translationKey: 'nav.talks',
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

    const result = buildDetailPathsForSection(entries as CollectionEntry<'talk'>[], talkConfig.routes)

    expect(result).toHaveLength(2)
    expect(result.find(p => p.params.locale === 'es')?.params.section).toBe('charla')
    expect(result.find(p => p.params.locale === 'en')?.params.section).toBe('talk')
  })

  test('handles empty entries array', () => {
    const result = buildDetailPathsForSection([] as CollectionEntry<'blog'>[], mockConfig.routes)
    expect(result).toEqual([])
  })

  test('handles entries with nested paths', () => {
    const entries = [
      {
        id: 'es/category/subcategory/2025-01-22-post',
        data: { title: 'Nested Post' }
      }
    ]

    const result = buildDetailPathsForSection(entries as CollectionEntry<'blog'>[], mockConfig.routes)

    expect(result).toHaveLength(1)
    expect(result[0].params.id).toBe('category/subcategory/2025-01-22-post')
  })
})

describe('buildAllDetailPaths', () => {
  test('combines paths from all sections', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async (collection: CollectionKey) => {
      if (collection === 'blog') {
        return [
          { id: 'es/blog-post-1', data: { title: 'Blog 1' } },
          { id: 'en/blog-post-1', data: { title: 'Blog 1' } }
        ] as CollectionEntry<CollectionKey>[]
      }
      if (collection === 'talk') {
        return [
          { id: 'es/talk-1', data: { title: 'Talk 1' } }
        ] as CollectionEntry<CollectionKey>[]
      }
      if (collection === 'work') {
        return [
          { id: 'es/work-1', data: { title: 'Work 1' } }
        ] as CollectionEntry<CollectionKey>[]
      }
      if (collection === 'projects') {
        return [
          { id: 'en/project-1', data: { title: 'Project 1' } }
        ] as CollectionEntry<CollectionKey>[]
      }
      if (collection === 'community') {
        return [] as CollectionEntry<CollectionKey>[]
      }
      return [] as CollectionEntry<CollectionKey>[]
    })

    const result = await buildAllDetailPaths(mockGetCollection)

    // Should have paths from blog (2), talk (1), work (1), projects (1) = 5 total
    expect(result.length).toBeGreaterThanOrEqual(5)
    expect(mockGetCollection).toHaveBeenCalled()
  })

  test('handles empty collections gracefully', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => [] as CollectionEntry<CollectionKey>[])

    const result = await buildAllDetailPaths(mockGetCollection)

    expect(result).toEqual([])
  })

  test('calls getCollection for each section configuration', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => [] as CollectionEntry<CollectionKey>[])

    await buildAllDetailPaths(mockGetCollection)

    // Should be called once per section (blog, talk, work, projects, community)
    expect(mockGetCollection).toHaveBeenCalledTimes(5)
  })

  test('properly injects getCollection dependency', async () => {
    const mockEntries = [
      { id: 'es/test', data: { title: 'Test' } }
    ]
    const mockGetCollection: FetchCollection = vi.fn(async () => mockEntries as CollectionEntry<CollectionKey>[])

    const result = await buildAllDetailPaths(mockGetCollection)

    expect(mockGetCollection).toHaveBeenCalled()
    expect(result.length).toBeGreaterThan(0)
  })
})

describe('buildSectionIndexPaths', () => {
  const mockGetCollection: FetchCollection = vi.fn(async () => [] as CollectionEntry<CollectionKey>[])

  test('builds paths for all sections and locales', async () => {
    const result = await buildSectionIndexPaths(mockGetCollection)

    // Should have paths for each section × 2 locales (es, en)
    // 5 sections (blog, talk, work, projects, community) × 2 locales = 10
    expect(result).toHaveLength(10)
  })

  test('includes correct section routes per locale', async () => {
    const result = await buildSectionIndexPaths(mockGetCollection)

    const blogEsPath = result.find(p => p.params.locale === 'es' && p.params.section === 'blog')
    const talkEsPath = result.find(p => p.params.locale === 'es' && p.params.section === 'charla')
    const talkEnPath = result.find(p => p.params.locale === 'en' && p.params.section === 'talk')

    expect(blogEsPath).toBeDefined()
    expect(talkEsPath).toBeDefined()
    expect(talkEnPath).toBeDefined()
  })

  test('includes config, posts and tags in props', async () => {
    const result = await buildSectionIndexPaths(mockGetCollection)

    for (const path of result) {
      expect(path.props.config).toBeDefined()
      expect(Array.isArray(path.props.posts)).toBe(true)
      expect(Array.isArray(path.props.tags)).toBe(true)
    }
  })
})

describe('buildTagPaths', () => {
  // fetchCollection returns all entries (all locales) for a collection in one call
  const mockFetchCollection: FetchCollection = vi.fn(async (collection: string) => {
    if (collection === 'blog' || collection === 'talk') {
      return [
        { id: 'es/post-1', data: { tags: ['typescript', 'astro'] } },
        { id: 'es/post-2', data: { tags: ['astro', 'testing'] } },
        { id: 'en/post-1', data: { tags: ['typescript'] } },
      ] as CollectionEntry<CollectionKey>[]
    }
    return [] as CollectionEntry<CollectionKey>[]
  })

  test('only builds paths for sections with tags enabled', async () => {
    const result = await buildTagPaths(mockFetchCollection)

    const sections = [...new Set(result.map(p => p.params.section))]
    // blog and talk have hasTags=true; work, project, community do not
    expect(sections).not.toContain('trabajo')
    expect(sections).not.toContain('work')
    expect(sections).not.toContain('proyecto')
    expect(sections).not.toContain('project')
    expect(sections).not.toContain('comunidad')
    expect(sections).not.toContain('community')
  })

  test('includes tag in both params and props', async () => {
    const result = await buildTagPaths(mockFetchCollection)

    expect(result.length).toBeGreaterThan(0)
    for (const path of result) {
      expect(path.params.tag).toBeDefined()
      expect(path.props.tag).toBeDefined()
      expect(path.params.tag).toBe(path.props.tag)
    }
  })

  test('includes allEntries, config and tagLocaleMap in props', async () => {
    const result = await buildTagPaths(mockFetchCollection)

    expect(result.length).toBeGreaterThan(0)
    for (const path of result) {
      expect(Array.isArray(path.props.allEntries)).toBe(true)
      expect(path.props.config).toBeDefined()
      expect(path.props.tagLocaleMap).toBeDefined()
    }
  })

  test('generates paths for each locale × tag combination', async () => {
    const result = await buildTagPaths(mockFetchCollection)

    // blog: es has [typescript, astro, testing] (3), en has [typescript] (1) → 4
    // talk: es has [typescript, astro, testing] (3), en has [typescript] (1) → 4
    // total = 8
    expect(result).toHaveLength(8)
  })

  test('uses correct section route per locale', async () => {
    const result = await buildTagPaths(mockFetchCollection)

    const talkEs = result.filter(p => p.params.locale === 'es' && p.params.section === 'charla')
    const talkEn = result.filter(p => p.params.locale === 'en' && p.params.section === 'talk')

    expect(talkEs.length).toBeGreaterThan(0)
    expect(talkEn.length).toBeGreaterThan(0)
  })

  test('returns empty when no posts have tags', async () => {
    const emptyMock: FetchCollection = vi.fn(async () => [{ id: 'es/post', data: {} }] as CollectionEntry<CollectionKey>[])
    const result = await buildTagPaths(emptyMock)

    expect(result).toEqual([])
  })

  test('deduplicates tags within the same locale', async () => {
    const dupesMock: FetchCollection = vi.fn(async () => [
      { id: 'es/post-1', data: { tags: ['astro', 'astro', 'ts'] } },
      { id: 'es/post-2', data: { tags: ['ts'] } },
      { id: 'en/post-1', data: { tags: ['astro', 'astro', 'ts'] } },
      { id: 'en/post-2', data: { tags: ['ts'] } },
    ] as CollectionEntry<CollectionKey>[])
    const result = await buildTagPaths(dupesMock)

    // 2 sections (blog, talk) × 2 locales × 2 unique tags = 8
    expect(result).toHaveLength(8)
  })
})
