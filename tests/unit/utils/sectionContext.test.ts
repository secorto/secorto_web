import { describe, it, expect, vi } from 'vitest'

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

  it('buildDetailPageContext returns null when entry not found in requested locale', async () => {
    vi.resetModules()
    // loadEntryByRoute returns null (entry doesn't exist)
    const loadEntry = vi.fn(async (_section: string, _locale: string, _id: string) => null)

    const { buildDetailPageContext } = await import('@utils/sectionContext')
    const ctx = await buildDetailPageContext('blog', 'es', 'nonexistent', loadEntry)
    expect(ctx).toBeNull()
  })

  it('buildDetailPageContext returns null when section not found', async () => {
    vi.resetModules()
    const loadEntry = vi.fn(async () => null)
    // sectionsConfig doesn't contain matching route slug
    vi.doMock('@config/sections', () => ({ sectionsConfig: {}, getSectionConfigByRoute: (_r: string, _l: string) => null }))
    const { buildDetailPageContext } = await import('@utils/sectionContext')
    const res = await buildDetailPageContext('nope', 'es', 'id', loadEntry)
    expect(res).toBeNull()
  })
})
