import { describe, it, expect } from 'vitest'
import { mapPostToRSSItem } from '@utils/rssBuilder'

describe('rssBuilder', () => {
  it('mapPostToRSSItem maps post fields to RSS item', () => {
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

  it('mapPostToRSSItem uses description when excerpt is missing', () => {
    const post = {
      data: { title: 'Fallback description', description: 'Legacy summary', date: new Date('2024-12-31') },
      id: 'es/fallback-description'
    }

    const item = mapPostToRSSItem(post, 'blog', 'es')
    expect(item.title).toBe('Fallback description')
    expect(item.description).toBe('Legacy summary')
    expect(item.link).toBe('/es/blog/fallback-description')
    expect(item.pubDate).toEqual(new Date('2024-12-31'))
  })

  it('mapPostToRSSItem falls back to empty description when excerpt and description are missing', () => {
    const post = {
      data: { title: 'No desc', date: new Date('1980-01-01') },
      id: 'en/no-desc'
    }

    const item = mapPostToRSSItem(post, 'work', 'en')
    expect(item.title).toBe('No desc')
    expect(item.description).toBe('')
    expect(item.link).toBe('/en/work/no-desc')
    expect(item.pubDate).toEqual(new Date('1980-01-01'))
  })
})
