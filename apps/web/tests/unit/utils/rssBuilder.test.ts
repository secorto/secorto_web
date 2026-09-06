import { describe, it, expect } from 'vitest'
import { mapPostToRSSItem } from '@utils/rssBuilder'

describe('rssBuilder helpers', () => {
  it('mapPostToRSSItem maps fields correctly', () => {
    const post = {
      data: { title: 'My Post', excerpt: 'Short', date: new Date('2025-01-01') },
      id: 'es/2025-01-01-my-post'
    }

    const item = mapPostToRSSItem(post, 'blog', 'es')
    expect(item.title).toBe('My Post')
    expect(item.description).toBe('Short')
    expect(item.link).toBe('/es/blog/2025-01-01-my-post')
    expect(item.pubDate).toEqual(new Date('2025-01-01'))
  })

  it('mapPostToRSSItem falls back description and date', () => {
    const post = {
      data: { title: 'No desc', date: new Date('1980-01-01') },
      id: 'en/no-desc'
    }

    const item = mapPostToRSSItem(post, 'work', 'en')
    expect(item.description).toBe('')
    expect(item.link).toBe('/en/work/no-desc')
    expect(item.pubDate).toEqual(new Date('1980-01-01'))
  })
})
