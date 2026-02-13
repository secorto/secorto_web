import { describe, it, expect, vi } from 'vitest'

describe('loadSectionByRoute & loadEntryByRoute', () => {
  it('returns posts and tags when config.hasTags = true', async () => {
    vi.resetModules()

    const mockPosts = [{ id: 'es/one', data: { slug: 'one' } }]

    vi.doMock('@config/sections', () => ({
      getSectionConfigByRoute: (_route: string, _locale: string) => ({ collection: 'blog', hasTags: true, routes: { es: 'blog', en: 'blog' } })
    }))

    const getPostsMock = vi.fn(async () => mockPosts)
    const getUniqueMock = vi.fn(() => ['a', 'b'])
    vi.doMock('@utils/paths', () => ({ getPostsByLocale: getPostsMock, getUniqueTags: getUniqueMock }))

    const { loadSectionByRoute } = await import('@utils/sectionLoader')

    const res = await loadSectionByRoute('blog', 'es')
    expect(res).not.toBeNull()
    expect(res!.posts).toEqual(mockPosts)
    expect(res!.tags).toEqual(['a', 'b'])
    expect(getPostsMock).toHaveBeenCalledWith('blog', 'es')
    expect(getUniqueMock).toHaveBeenCalled()
  })

  it('returns posts and empty tags when config.hasTags = false', async () => {
    vi.resetModules()

    const mockPosts = [{ id: 'es/one', data: { slug: 'one' } }]

    vi.doMock('@config/sections', () => ({
      getSectionConfigByRoute: (_route: string, _locale: string) => ({ collection: 'work', hasTags: false, routes: { es: 'trabajo', en: 'work' } })
    }))

    const getPostsMock = vi.fn(async () => mockPosts)
    const getUniqueMock = vi.fn(() => ['should-not-be-called'])
    vi.doMock('@utils/paths', () => ({ getPostsByLocale: getPostsMock, getUniqueTags: getUniqueMock }))

    const { loadSectionByRoute } = await import('@utils/sectionLoader')

    const res = await loadSectionByRoute('trabajo', 'es')
    expect(res).not.toBeNull()
    expect(res!.posts).toEqual(mockPosts)
    expect(res!.tags).toEqual([])
    expect(getPostsMock).toHaveBeenCalledWith('work', 'es')
    expect(getUniqueMock).not.toHaveBeenCalled()
  })

  it('loadEntryByRoute finds entry by slug and by cleanId', async () => {
    vi.resetModules()

    const entries = [
      { id: 'es/2025-01-01-title', data: {} },
      { id: 'es/2025-02-02-slugged', data: { slug: 'my-slug' } }
    ]

    vi.doMock('@config/sections', () => ({
      getSectionConfigByRoute: (route: string, _locale: string) => route === 'blog' ? ({ collection: 'blog', hasTags: true, routes: { es: 'blog', en: 'blog' } }) : null
    }))

    vi.doMock('astro:content', () => ({ getCollection: vi.fn(async () => entries) }))

    const { loadEntryByRoute } = await import('@utils/sectionLoader')

    const bySlug = await loadEntryByRoute('blog', 'es', 'my-slug')
    expect(bySlug).not.toBeNull()
    expect(bySlug!.entry.data.slug).toBe('my-slug')

    const byClean = await loadEntryByRoute('blog', 'es', '2025-01-01-title')
    expect(byClean).not.toBeNull()
    expect(byClean!.entry.id).toBe('es/2025-01-01-title')
  })

  it('loadEntryByRoute throws when no matching entry', async () => {
    vi.resetModules()
    const entries = [ { id: 'es/one', data: {} } ]
    vi.doMock('@config/sections', () => ({
      getSectionConfigByRoute: (_route: string, _locale: string) => ({ collection: 'blog', hasTags: true, routes: { es: 'blog', en: 'blog' } })
    }))
    vi.doMock('astro:content', () => ({ getCollection: vi.fn(async () => entries) }))
    const { loadEntryByRoute } = await import('@utils/sectionLoader')
    await expect(loadEntryByRoute('blog', 'es', 'nonexistent')).rejects.toThrow('Entry not found')
  })
})
