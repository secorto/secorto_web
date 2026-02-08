import { test, expect, vi } from 'vitest'

let mockGetCollection: (name: string) => Promise<unknown[]> = async () => []

vi.mock('astro:content', () => ({
  getCollection: (name: string) => mockGetCollection(name),
}))

import { buildTranslationMap } from '../../src/i18n/buildTranslationMap'

test('buildTranslationMap groups translations using canonical when present', async () => {
  mockGetCollection = async () => [
    {
      id: 'es/blog/post-1',
      data: { title: 'Post ES', canonical: 'post-1', date: new Date('2020-01-01') },
    },
    {
      id: 'en/blog/post-1',
      data: { title: 'Post EN', canonical: 'post-1', date: new Date('2020-01-01') },
    },
  ]

  const map = await buildTranslationMap('blog')

  expect(map['post-1']).toBeTruthy()
  expect(map['post-1'].es).toBeTruthy()
  expect(map['post-1'].en).toBeTruthy()
  expect(map['post-1'].es.slug).toBe('blog/post-1')
  expect(map['post-1'].en.slug).toBe('blog/post-1')
  expect(map['post-1'].es.title).toBe('Post ES')
})

test('buildTranslationMap handles id with no slug (slug empty) and uses canonical fallback', async () => {
  // Case A: canonical provided -> key is canonical
  mockGetCollection = async () => [
    { id: 'es', data: { title: 'Root ES', canonical: 'blog' } },
  ]

  let map = await buildTranslationMap('blog')
  expect(map['blog']).toBeTruthy()
  expect(map['blog'].es.slug).toBe('')

  // Case B: no canonical and id has no slash -> canonical becomes empty string
  mockGetCollection = async () => [
    { id: 'es', data: { title: 'Root ES' } },
  ]

  map = await buildTranslationMap('blog')
  expect(map['']).toBeTruthy()
  expect(map[''].es.slug).toBe('')
  expect(map[''].es.id).toBe('es')
})
