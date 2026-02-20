import { beforeEach, describe, it, expect, vi } from 'vitest'
import type { SectionConfig } from '@config/sections'

// Top-level mocks to avoid repeated module reloads
vi.mock('@config/sections', () => ({ getSectionConfigByRoute: vi.fn() }))
vi.mock('@utils/paths', () => ({ getPostsByLocale: vi.fn(), getUniqueTags: vi.fn() }))
vi.mock('astro:content', () => ({ getCollection: vi.fn() }))

import { loadSectionByRoute, loadEntryByRoute } from '@utils/sectionLoader'
import { getSectionConfigByRoute } from '@config/sections'
import { getPostsByLocale, getUniqueTags } from '@utils/paths'
import { getCollection } from 'astro:content'
import type { CollectionEntry, CollectionKey } from 'astro:content'

describe('loadSectionByRoute & loadEntryByRoute', () => {
  const defaultBlogConfig: SectionConfig = {
    collection: 'blog',
    translationKey: 'nav.blog',
    hasTags: true,
    routes: { es: 'blog', en: 'blog' },
    listComponent: 'ListPost',
    detailComponent: 'BlogTalkPostView',
    showFeaturedImage: false
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns posts and tags when config.hasTags = true', async () => {
    const mockPosts = [{ id: 'es/one', data: { slug: 'one' } }]

    vi.mocked(getSectionConfigByRoute).mockImplementation((_route: string, _locale: string) => ({ ...defaultBlogConfig }))
    const getPostsMock = vi.mocked(getPostsByLocale).mockImplementation(async () => mockPosts)
    const getUniqueMock = vi.mocked(getUniqueTags).mockImplementation(() => ['a', 'b'])

    const res = await loadSectionByRoute('blog', 'es')
    expect(res).not.toBeNull()
    expect(res!.posts).toEqual(mockPosts)
    expect(res!.tags).toEqual(['a', 'b'])
    expect(getPostsMock).toHaveBeenCalledWith('blog', 'es')
    expect(getUniqueMock).toHaveBeenCalled()
  })

  it('returns posts and empty tags when config.hasTags = false', async () => {
    const mockPosts = [{ id: 'es/one', data: { slug: 'one' } }]
    const workConfig = { ...defaultBlogConfig, collection: 'work', hasTags: false, routes: { es: 'trabajo', en: 'work' } }

    vi.mocked(getSectionConfigByRoute).mockImplementation((_route: string, _locale: string) => (workConfig as SectionConfig))
    const getPostsMock = vi.mocked(getPostsByLocale).mockImplementation(async () => mockPosts)
    const getUniqueMock = vi.mocked(getUniqueTags).mockImplementation(() => ['should-not-be-called'])
    const res = await loadSectionByRoute('trabajo', 'es')
    expect(res).not.toBeNull()
    expect(res!.posts).toEqual(mockPosts)
    expect(res!.tags).toEqual([])
    expect(getPostsMock).toHaveBeenCalledWith('work', 'es')
    expect(getUniqueMock).not.toHaveBeenCalled()
  })

  it('loadEntryByRoute finds entry by slug and by cleanId', async () => {
    const entries: CollectionEntry<CollectionKey>[] = [
      { id: 'es/2025-01-01-title', data: {} } as unknown as CollectionEntry<CollectionKey>,
      { id: 'es/2025-02-02-slugged', data: { slug: 'my-slug' } } as unknown as CollectionEntry<CollectionKey>
    ]
    // Always return a valid SectionConfig to satisfy TypeScript and code expectations
    vi.mocked(getSectionConfigByRoute).mockImplementation((_route: string, _locale: string) => ({ ...defaultBlogConfig }))
    vi.mocked(getCollection).mockResolvedValue(entries)
    const bySlug = await loadEntryByRoute('blog', 'es', 'my-slug')
    expect(bySlug).not.toBeNull()
    expect(bySlug!.entry.data.slug).toBe('my-slug')

    const byClean = await loadEntryByRoute('blog', 'es', '2025-01-01-title')
    expect(byClean).not.toBeNull()
    expect(byClean!.entry.id).toBe('es/2025-01-01-title')
  })

  it('loadEntryByRoute throws when no matching entry', async () => {
    const entries: CollectionEntry<CollectionKey>[] = [ { id: 'es/one', data: {} } as unknown as CollectionEntry<CollectionKey> ]
    vi.mocked(getSectionConfigByRoute).mockImplementation((_route: string, _locale: string) => ({ ...defaultBlogConfig }))
    vi.mocked(getCollection).mockResolvedValue(entries)
    await expect(loadEntryByRoute('blog', 'es', 'nonexistent')).rejects.toThrow('Entry not found')
  })
})
