import { describe, it, expect, vi } from 'vitest'
import { getUniqueTags } from '../../../src/utils/paths'

describe('paths utils', () => {
  it('getPostsByLocale filters by locale and sets cleanId', async () => {
    const posts = [
      { id: 'en/one', data: { slug: 'one' } },
      { id: 'es/dos', data: { slug: 'dos' } }
    ]
    vi.resetModules()
    vi.doMock('astro:content', () => ({ getCollection: vi.fn(async () => posts) }))
    const { getPostsByLocale } = await import('../../../src/utils/paths')
    const res = await getPostsByLocale('blog', 'en')
    expect(res.length).toBe(1)
    expect(res[0].cleanId).toBe('one')
  })

  it('getUniqueTags extracts unique tags', () => {
    const posts = [
      { data: { tags: ['a', 'b'] } },
      { data: { tags: ['b', 'c'] } }
    ]
    const tags = getUniqueTags(posts)
    expect(tags).toEqual(['a', 'b', 'c'])
  })
})
