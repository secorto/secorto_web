import { test, expect, vi, describe } from 'vitest'

let mockGetCollection: (name: string) => Promise<unknown[]> = async () => []

vi.mock('astro:content', () => ({
  getCollection: (name: string) => mockGetCollection(name),
}))

import { getAvailableLocalesForEntry } from '@utils/translationHelpers'

describe('getAvailableLocalesForEntry', () => {
  test('returns both locales when entry exists in es and en', async () => {
    mockGetCollection = async () => [
      { id: 'es/2025-01-22-my-post', data: { title: 'Mi Post' } },
      { id: 'en/2025-01-22-my-post', data: { title: 'My Post' } },
    ]

    const locales = await getAvailableLocalesForEntry('blog', '2025-01-22-my-post')

    expect(locales).toHaveLength(2)
    expect(locales).toContain('es')
    expect(locales).toContain('en')
  })

  test('returns only es when entry exists only in Spanish', async () => {
    mockGetCollection = async () => [
      { id: 'es/2025-01-22-spanish-only', data: { title: 'Solo Español' } },
      { id: 'en/2025-01-22-other-post', data: { title: 'Other Post' } },
    ]

    const locales = await getAvailableLocalesForEntry('blog', '2025-01-22-spanish-only')

    expect(locales).toHaveLength(1)
    expect(locales).toContain('es')
    expect(locales).not.toContain('en')
  })

  test('returns only en when entry exists only in English', async () => {
    mockGetCollection = async () => [
      { id: 'en/2025-01-22-english-only', data: { title: 'English Only' } },
      { id: 'es/2025-01-22-otro-post', data: { title: 'Otro Post' } },
    ]

    const locales = await getAvailableLocalesForEntry('blog', '2025-01-22-english-only')

    expect(locales).toHaveLength(1)
    expect(locales).toContain('en')
    expect(locales).not.toContain('es')
  })

  test('returns empty array when entry does not exist in any locale', async () => {
    mockGetCollection = async () => [
      { id: 'es/2025-01-22-some-post', data: { title: 'Algún Post' } },
      { id: 'en/2025-01-22-another-post', data: { title: 'Another Post' } },
    ]

    const locales = await getAvailableLocalesForEntry('blog', '2025-01-22-nonexistent')

    expect(locales).toHaveLength(0)
  })

  test('handles entries with nested paths correctly', async () => {
    mockGetCollection = async () => [
      { id: 'es/talks/2023-09-27-devcontainers', data: { title: 'DevContainers' } },
      { id: 'en/talks/2023-09-27-devcontainers', data: { title: 'DevContainers' } },
    ]

    const locales = await getAvailableLocalesForEntry('talk', 'talks/2023-09-27-devcontainers')

    expect(locales).toHaveLength(2)
    expect(locales).toContain('es')
    expect(locales).toContain('en')
  })

  test('handles entries without date prefix', async () => {
    mockGetCollection = async () => [
      { id: 'es/simple-slug', data: { title: 'Slug Simple' } },
      { id: 'en/simple-slug', data: { title: 'Simple Slug' } },
    ]

    const locales = await getAvailableLocalesForEntry('projects', 'simple-slug')

    expect(locales).toHaveLength(2)
    expect(locales).toContain('es')
    expect(locales).toContain('en')
  })

  test('works with different collections', async () => {
    mockGetCollection = async (collectionName) => {
      if (collectionName === 'work') {
        return [
          { id: 'es/my-work', data: { title: 'Mi Trabajo' } },
          { id: 'en/my-work', data: { title: 'My Work' } },
        ]
      }
      return []
    }

    const locales = await getAvailableLocalesForEntry('work', 'my-work')

    expect(locales).toHaveLength(2)
    expect(locales).toContain('es')
    expect(locales).toContain('en')
  })

  test('returns empty array when collection is empty', async () => {
    mockGetCollection = async () => []

    const locales = await getAvailableLocalesForEntry('blog', 'any-post')

    expect(locales).toHaveLength(0)
  })
})
