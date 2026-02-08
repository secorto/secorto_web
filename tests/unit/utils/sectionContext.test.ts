import { describe, it, expect, vi } from 'vitest'
import type { DetailPageContext } from '@utils/sectionContext'
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

  it('buildSectionContext throws 404 when not found', async () => {
    vi.resetModules()
    vi.doMock('@config/sections', () => ({ getSectionConfigByRoute: (_route: string, _locale: string) => null }))
    const { buildSectionContext } = await import('@utils/sectionContext')
    expect(() => buildSectionContext('nope', 'es')).toThrow()
  })

  it('buildTagsPageContext filters posts and aggregates tags', async () => {
    vi.resetModules()
    vi.doMock('@config/sections', () => ({ getSectionConfigByRoute: (_route: string, _locale: string) => ({ collection: 'blog', routes: { es: 'blog', en: 'blog' } }) }))
    const mockPosts = [
      { id: 'es/one', data: { tags: ['a', 'b'] } },
      { id: 'es/two', data: { tags: ['b', 'c'] } },
      { id: 'en/other', data: { tags: ['x'] } }
    ]
    vi.doMock('@utils/paths', () => ({ getPostsByLocale: vi.fn(async (_collection: string, localeArg: string) => mockPosts.filter((p: { id: string }) => p.id.startsWith(`${localeArg}/`))) }))

    const { buildTagsPageContext } = await import('@utils/sectionContext')
    const ctx = (await buildTagsPageContext('blog', 'es', 'b'))
    expect(ctx.posts.length).toBe(2)
    expect(ctx.tags.sort()).toEqual(['a', 'b', 'c'].sort())
  })

  it('buildDetailPageContext returns loaded entry when loadEntryByRoute finds it', async () => {
    vi.resetModules()
    const fakeLoaded: { entry: { id: string; data: Record<string, unknown> }; config: SectionConfig } = { entry: { id: 'es/one', data: {} }, config: { collection: 'blog' } as SectionConfig }
    const loadEntry = vi.fn(async (_section: string, _locale: string, _id: string) => fakeLoaded)
    const { buildDetailPageContext } = await import('@utils/sectionContext')
    const ctx = (await buildDetailPageContext('blog', 'es', 'one', loadEntry))
    expect(ctx).not.toBeNull()
    expect((ctx as DetailPageContext).isUntranslated).toBe(false)
    expect((ctx as DetailPageContext).entry.id).toBe('es/one')
  })

  it('buildDetailPageContext falls back to other locale when not found in requested', async () => {
    vi.resetModules()
    // loadEntryByRoute returns null
    const loadEntry = vi.fn(async (_section: string, _locale: string, _id: string) => null)
    // getSectionConfigByRouteSlug should find section and locale
    vi.doMock('@config/sections', () => ({ sectionsConfig: { blog: { collection: 'blog', routes: { es: 'blog', en: 'blog' } } }, /* keep getSectionConfigByRoute used elsewhere */ getSectionConfigByRoute: (_r: string, _l: string) => ({ collection: 'blog', routes: { es: 'blog', en: 'blog' } }) }))
    // getCollection returns entries in other locale
    const entries: { id: string; data: Record<string, unknown> }[] = [ { id: 'en/one', data: {} } ]
    vi.doMock('astro:content', () => ({ getCollection: vi.fn(async () => entries) }))

    const { buildDetailPageContext } = await import('@utils/sectionContext')
    const ctx = (await buildDetailPageContext('blog', 'es', 'one', loadEntry))
    expect(ctx).not.toBeNull()
    expect((ctx as DetailPageContext).isUntranslated).toBe(true)
    expect((ctx as DetailPageContext).locale).toBe('en')
    expect((ctx as DetailPageContext).entry.id).toBe('en/one')
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
