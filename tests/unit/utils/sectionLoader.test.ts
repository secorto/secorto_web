import { describe, it, expect, vi } from 'vitest'


describe('sectionLoader', () => {
  it('loadEntryByRoute returns entry when it exists for route and locale', async () => {
    const entries = [
      { id: 'en/post1', data: { slug: 'post1' } },
      { id: 'en/post2', data: { slug: 'post2' } }
    ]
    vi.resetModules()
    vi.doMock('astro:content', () => ({ getCollection: vi.fn(async () => entries) }))
    const { loadEntryByRoute } = await import('@utils/sectionLoader')
    const res = await loadEntryByRoute('blog', 'en', 'post1')
    expect(res).not.toBeNull()
    if (res) {
      expect(res.entry.id).toBe('en/post1')
    }
  })
})
