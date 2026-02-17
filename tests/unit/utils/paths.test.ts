import { describe, beforeEach, it, expect, vi } from 'vitest'

var posts: { id?: string, data: { slug?: string, tags?: string[] }}[];

describe('paths utils', () => {
  beforeEach(() => {    
    vi.doMock('astro:content', () => ({ getCollection: vi.fn(async () => posts) }))
  })

  it('getPostsByLocale filters by locale and sets cleanId', async () => {
    posts = [
      { id: 'en/one', data: { slug: 'one' } },
      { id: 'es/dos', data: { slug: 'dos' } }
    ]
    const { getPostsByLocale } = await import('@utils/paths')
    const res = await getPostsByLocale('blog', 'en')
    expect(res.length).toBe(1)
    expect(res[0].cleanId).toBe('one')
  })

  it('uses extractCleanId when post.data.slug is missing', async () => {
    posts = [
      { id: 'en/2024-12-31-title', data: {} },
      { id: 'en/2023-01-01-other', data: { slug: 'custom' } },
    ]
    const { getPostsByLocale } = await import('@utils/paths')
    const res = await getPostsByLocale('blog', 'en')
    // one entry should derive cleanId from id
    
    expect(res.some(r => r.cleanId === '2024-12-31-title')).toBe(true)
    // other entry uses provided slug
    expect(res.some(r => r.cleanId === 'custom')).toBe(true)
  })

  it('getUniqueTags extracts unique tags and handles missing tags', async () => {
    posts = [
      { data: { tags: ['a', 'b'] } },
      { data: { } },
      { data: { tags: ['b', 'c'] } }
    ]
    const { getUniqueTags } = await import('@utils/paths')
    const tags = getUniqueTags(posts)
    expect(tags).toEqual(['a', 'b', 'c'])
  })
})
