import { describe, it, expect, vi } from 'vitest'
import { getUniqueTags } from '@utils/paths'

describe('paths utils', () => {
  it('getPostsByLocale filters by locale and sets cleanId', async () => {
    const posts = [
      { id: 'en/one', data: { slug: 'one' } },
      { id: 'es/dos', data: { slug: 'dos' } }
    ]
    vi.resetModules()
    vi.doMock('astro:content', () => ({ getCollection: vi.fn(async () => posts) }))
    const { getPostsByLocale } = await import('@utils/paths')
    const res = await getPostsByLocale('blog', 'en')
    expect(res.length).toBe(1)
    expect(res[0].cleanId).toBe('one')
  })

  it('uses extractCleanId when post.data.slug is missing', async () => {
    const posts = [
      { id: 'en/2024-12-31-title', data: {} },
      { id: 'en/2023-01-01-other', data: { slug: 'custom' } },
    ]
    vi.resetModules()
    vi.doMock('astro:content', () => ({ getCollection: vi.fn(async () => posts) }))
    const { getPostsByLocale } = await import('@utils/paths')
    const res = await getPostsByLocale('blog', 'en')
    // one entry should derive cleanId from id
    expect(res.some(r => r.cleanId === '2024-12-31-title')).toBe(true)
    // other entry uses provided slug
    expect(res.some(r => r.cleanId === 'custom')).toBe(true)
  })

  it('excludes draft posts from getPostsByLocale results', async () => {
    const posts = [
      { id: 'en/one', data: { slug: 'one', draft: true } },
      { id: 'en/two', data: { slug: 'two' } }
    ]
    vi.resetModules()
    vi.doMock('astro:content', () => ({ getCollection: vi.fn(async () => posts) }))
    const { getPostsByLocale } = await import('@utils/paths')
    const res = await getPostsByLocale('blog', 'en')
    expect(res.length).toBe(1)
    expect(res.some(r => r.cleanId === 'one')).toBe(false)
    expect(res.some(r => r.cleanId === 'two')).toBe(true)
  })

  it('getUniqueTags extracts unique tags and handles missing tags', () => {
    const posts = [
      { data: { tags: ['a', 'b'] } },
      { data: { } },
      { data: { tags: ['b', 'c'] } }
    ]
    const tags = getUniqueTags(posts)
    expect(tags).toEqual(['a', 'b', 'c'])
  })
})
