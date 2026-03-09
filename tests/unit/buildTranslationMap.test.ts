import { test, expect, vi } from 'vitest'

let mockGetCollection: (name: string) => Promise<unknown[]> = async () => []

vi.mock('astro:content', () => ({
  getCollection: (name: string) => mockGetCollection(name),
}))

import { buildTranslationMap } from '../../src/i18n/buildTranslationMap'

test('buildTranslationMap groups same-cleanId entries under the cleanId key', async () => {
  mockGetCollection = async () => [
    {
      id: 'es/blog/post-1',
      data: { title: 'Post ES', date: new Date('2020-01-01') },
    },
    {
      id: 'en/blog/post-1',
      data: { title: 'Post EN', date: new Date('2020-01-01') },
    },
  ]

  const map = await buildTranslationMap('blog')

  // keyed by cleanId = 'blog/post-1'
  expect(map['blog/post-1']).toBeTruthy()
  expect(map['blog/post-1'].es).toBeTruthy()
  expect(map['blog/post-1'].en).toBeTruthy()
  expect(map['blog/post-1'].es.slug).toBe('blog/post-1')
  expect(map['blog/post-1'].en.slug).toBe('blog/post-1')
  expect(map['blog/post-1'].es.title).toBe('Post ES')
})

test('buildTranslationMap groups by postId when cleanIds differ across locales', async () => {
  mockGetCollection = async () => [
    { id: 'es/calendario', data: { title: 'Calendario', postId: 'calendar-series' } },
    { id: 'en/calendar', data: { title: 'Calendar', postId: 'calendar-series' } },
  ]

  const map = await buildTranslationMap('blog')

  // Both locale slugs resolve to the same series
  expect(map['calendario']).toBeTruthy()
  expect(map['calendar']).toBeTruthy()
  expect(map['calendario']).toBe(map['calendar'])
  expect(map['calendario'].es.slug).toBe('calendario')
  expect(map['calendario'].en.slug).toBe('calendar')
})
