import { describe, it, expect, vi } from 'vitest'
import type { CollectionEntry } from 'astro:content'
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

  it('buildDetailPageContext returns context when entry is found', async () => {
    vi.resetModules()
    const mockEntry = { id: 'es/2026-01-01-post', data: { title: 'Post' } }
    const mockConfig = { collection: 'blog', routes: { es: 'blog', en: 'blog' } }
    const loadEntry = vi.fn(async () => ({ entry: mockEntry, config: mockConfig }))

    const { buildDetailPageContext } = await import('@utils/sectionContext')
    const ctx = await buildDetailPageContext(
      'blog',
      'es',
      '2026-01-01-post',
      loadEntry as unknown as (section: string, locale: 'en' | 'es', id: string) => Promise<{ entry: CollectionEntry<any>; config: SectionConfig }>
    )
    expect(ctx).not.toBeNull()
    expect(ctx?.entry).toEqual(mockEntry)
    expect(ctx?.config).toEqual(mockConfig)
    expect(ctx?.cleanId).toBe('2026-01-01-post')
  })
})
