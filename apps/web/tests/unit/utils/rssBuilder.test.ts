import { describe, it, expect, vi } from 'vitest'


describe('buildRSSItems', () => {
  it('builds RSS items from posts and uses cleanId/slug', async () => {
    const posts = [
      { id: 'en/post-one', data: { title: 'T1', excerpt: 'E1', date: '2020-01-01', slug: 'post-one' }, cleanId: 'post-one' }
    ]
    vi.resetModules()
    vi.doMock('@utils/paths', () => ({ getPostsByLocale: vi.fn(async () => posts) }))
    const { buildRSSItems } = await import('@utils/rssBuilder')
    const items = await buildRSSItems('blog', 'en')
    expect(items.length).toBe(1)
    expect(items[0].title).toBe('T1')
    expect(items[0].link).toContain('/en/blog/post-one')
    expect(items[0].pubDate instanceof Date).toBe(true)
  })
})
