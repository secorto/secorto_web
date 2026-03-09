import { describe, it, expect, vi } from 'vitest'

describe('loadSectionByRoute', () => {
  it('returns posts and tags when collection is blog', async () => {
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

  it('returns posts and empty tags when collection is work', async () => {
    vi.resetModules()

    const mockPosts = [{ id: 'es/one', data: { slug: 'one' } }]

    vi.doMock('@utils/sections', () => ({
      getSectionConfigByRoute: (_route: string, _locale: string) => ({ collection: 'work', routes: { es: 'trabajo', en: 'work' } })
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
})
