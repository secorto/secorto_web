import { describe, it, expect, vi } from 'vitest'

describe('loadSectionByRoute', () => {
  it('returns posts and tags for blog section', async () => {
    vi.resetModules()

    const mockPosts = [{ id: 'es/one', data: { slug: 'one' } }]

    vi.doMock('@config/sections', () => ({
      getSectionConfigByRoute: (_route: string, _locale: string) => ({ collection: 'blog', routes: { es: 'blog', en: 'blog' } })
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

  it('returns posts and tags for all sections including work', async () => {
    vi.resetModules()

    const mockPosts = [{ id: 'es/one', data: { slug: 'one' } }]

    vi.doMock('@config/sections', () => ({
      getSectionConfigByRoute: (_route: string, _locale: string) => ({ collection: 'work', routes: { es: 'trabajo', en: 'work' } })
    }))

    const getPostsMock = vi.fn(async () => mockPosts)
    const getUniqueMock = vi.fn(() => ['tag1', 'tag2'])
    vi.doMock('@utils/paths', () => ({ getPostsByLocale: getPostsMock, getUniqueTags: getUniqueMock }))

    const { loadSectionByRoute } = await import('@utils/sectionLoader')

    const res = await loadSectionByRoute('trabajo', 'es')
    expect(res).not.toBeNull()
    expect(res!.posts).toEqual(mockPosts)
    expect(res!.tags).toEqual(['tag1', 'tag2'])
    expect(getPostsMock).toHaveBeenCalledWith('work', 'es')
    expect(getUniqueMock).toHaveBeenCalled()
  })
})
