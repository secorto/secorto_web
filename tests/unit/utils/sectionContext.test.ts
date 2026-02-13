import { describe, it, expect, vi } from 'vitest'
import type { SectionConfig } from '@config/sections'

describe('sectionContext helpers', () => {
  it('buildSectionContext returns config when found', async () => {
    vi.resetModules()
    vi.doMock('@config/sections', () => ({ getSectionConfigByRoute: (_route: string, _locale: string) => ({ collection: 'blog', routes: { es: 'blog', en: 'blog' } }) }))
    const { buildSectionContext } = await import('@utils/sectionContext')
    const ctx = buildSectionContext('blog', 'es')
    expect(ctx.config.collection).toBe('blog')
    expect(ctx.locale).toBe('es')
    expect(ctx.section).toBe('blog')
  })

  it('buildTagsPageContext filters posts and aggregates tags', async () => {
    vi.resetModules()
    vi.doMock('@config/sections', () => ({ getSectionConfigByRoute: (_route: string, _locale: string) => ({ collection: 'blog', routes: { es: 'blog', en: 'blog' } }) }))
    const mockPosts = [
      { id: 'es/one', data: { tags: ['a', 'b'] } },
      { id: 'es/two', data: { tags: ['b', 'c'] } },
      { id: 'en/other', data: { tags: ['x'] } }
    ]
    vi.doMock('@utils/paths', () => ({
      getPostsByLocale: vi.fn(async (_collection: string, localeArg: string) => mockPosts.filter((p: { id: string }) => p.id.startsWith(`${localeArg}/`))),
      getUniqueTags: vi.fn((posts: { data: { tags?: string[] } }[]) => {
        const tags = posts.flatMap(p => p.data.tags ?? [])
        return Array.from(new Set(tags))
      })
    }))

    const { buildTagsPageContext } = await import('@utils/sectionContext')
    const ctx = (await buildTagsPageContext('blog', 'es', 'b'))
    expect(ctx.posts.length).toBe(2)
    expect(ctx.tags.sort()).toEqual(['a', 'b', 'c'].sort())
  })

  describe('buildDetailPageContext', () => {
    interface MockEntry { id: string; data: Record<string, unknown> }

    const blogConfig: SectionConfig = {
      collection: 'blog',
      translationKey: 'nav.blog',
      hasTags: true,
      routes: { es: 'blog', en: 'blog' },
      listComponent: 'ListPost',
      detailComponent: 'BlogTalkPostView',
      showFeaturedImage: false
    }

    const talkConfig: SectionConfig = {
      collection: 'talk',
      translationKey: 'nav.talks',
      hasTags: true,
      routes: { es: 'charlas', en: 'talks' },
      listComponent: 'ListPost',
      detailComponent: 'BlogTalkPostView',
      showFeaturedImage: false
    }

    function createLoadEntry(entry: MockEntry, config: SectionConfig) {
      return vi.fn(async (_section: string, _locale: 'en' | 'es', _id: string) => ({ entry, config }))
    }

    it('returns entry, config, locale and cleanId when entry is found', async () => {
      vi.resetModules()
      const mockEntry: MockEntry = { id: 'es/2026-01-01-post', data: { title: 'Post' } }

      const { buildDetailPageContext } = await import('@utils/sectionContext')
      const ctx = await buildDetailPageContext<MockEntry>('blog', 'es', '2026-01-01-post', createLoadEntry(mockEntry, blogConfig))

      expect(ctx.entry).toEqual(mockEntry)
      expect(ctx.config).toEqual(blogConfig)
      expect(ctx.locale).toBe('es')
      expect(ctx.cleanId).toBe('2026-01-01-post')
    })

    it('strips locale prefix from entry id to produce cleanId', async () => {
      vi.resetModules()
      const mockEntry: MockEntry = { id: 'en/my-slug', data: {} }

      const { buildDetailPageContext } = await import('@utils/sectionContext')
      const ctx = await buildDetailPageContext<MockEntry>('blog', 'en', 'my-slug', createLoadEntry(mockEntry, blogConfig))

      expect(ctx.cleanId).toBe('my-slug')
    })

    it('passes section, locale and id to loadEntryByRoute', async () => {
      vi.resetModules()
      const mockEntry: MockEntry = { id: 'es/post-1', data: {} }
      const loadEntry = createLoadEntry(mockEntry, talkConfig)

      const { buildDetailPageContext } = await import('@utils/sectionContext')
      await buildDetailPageContext<MockEntry>('charlas', 'es', 'post-1', loadEntry)

      expect(loadEntry).toHaveBeenCalledWith('charlas', 'es', 'post-1')
    })

    it('propagates error when loadEntryByRoute rejects', async () => {
      vi.resetModules()
      const loadEntry = vi.fn(async () => { throw new Error('Entry not found for blog/missing (es)') })

      const { buildDetailPageContext } = await import('@utils/sectionContext')

      await expect(buildDetailPageContext('blog', 'es', 'missing', loadEntry)).rejects.toThrow('Entry not found')
    })

    it('preserves full cleanId with date prefix', async () => {
      vi.resetModules()
      const mockEntry: MockEntry = { id: 'es/2025-06-15-mi-articulo', data: { title: 'Artículo' } }

      const { buildDetailPageContext } = await import('@utils/sectionContext')
      const ctx = await buildDetailPageContext<MockEntry>('blog', 'es', '2025-06-15-mi-articulo', createLoadEntry(mockEntry, blogConfig))

      expect(ctx.cleanId).toBe('2025-06-15-mi-articulo')
    })
  })
})
