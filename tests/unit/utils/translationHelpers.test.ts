import { test, expect, describe } from 'vitest'
import { getAvailableLocalesForEntry } from '@utils/translationHelpers'
import type { CollectionEntry, CollectionKey } from 'astro:content'

// Minimal helper to build fake entries for testing
const entry = (id: string, data: Record<string, unknown> = {}): CollectionEntry<CollectionKey> =>
  ({ id, data }) as CollectionEntry<CollectionKey>

describe('getAvailableLocalesForEntry', () => {
  test('returns both locales when entry exists in es and en', () => {
    const entries = [
      entry('es/2025-01-22-my-post', { title: 'Mi Post' }),
      entry('en/2025-01-22-my-post', { title: 'My Post' }),
    ]

    const locales = getAvailableLocalesForEntry(entries, '2025-01-22-my-post')

    expect(locales).toHaveLength(2)
    expect(locales).toContain('es')
    expect(locales).toContain('en')
  })

  test('returns only es when entry exists only in Spanish', () => {
    const entries = [
      entry('es/2025-01-22-spanish-only', { title: 'Solo Español' }),
      entry('en/2025-01-22-other-post', { title: 'Other Post' }),
    ]

    const locales = getAvailableLocalesForEntry(entries, '2025-01-22-spanish-only')

    expect(locales).toHaveLength(1)
    expect(locales).toContain('es')
    expect(locales).not.toContain('en')
  })

  test('returns only en when entry exists only in English', () => {
    const entries = [
      entry('en/2025-01-22-english-only', { title: 'English Only' }),
      entry('es/2025-01-22-otro-post', { title: 'Otro Post' }),
    ]

    const locales = getAvailableLocalesForEntry(entries, '2025-01-22-english-only')

    expect(locales).toHaveLength(1)
    expect(locales).toContain('en')
    expect(locales).not.toContain('es')
  })

  test('returns empty array when entry does not exist in any locale', () => {
    const entries = [
      entry('es/2025-01-22-some-post', { title: 'Algún Post' }),
      entry('en/2025-01-22-another-post', { title: 'Another Post' }),
    ]

    const locales = getAvailableLocalesForEntry(entries, '2025-01-22-nonexistent')

    expect(locales).toHaveLength(0)
  })

  test('handles entries with nested paths correctly', () => {
    const entries = [
      entry('es/talks/2023-09-27-devcontainers', { title: 'DevContainers' }),
      entry('en/talks/2023-09-27-devcontainers', { title: 'DevContainers' }),
    ]

    const locales = getAvailableLocalesForEntry(entries, 'talks/2023-09-27-devcontainers')

    expect(locales).toHaveLength(2)
    expect(locales).toContain('es')
    expect(locales).toContain('en')
  })

  test('handles entries without date prefix', () => {
    const entries = [
      entry('es/simple-slug', { title: 'Slug Simple' }),
      entry('en/simple-slug', { title: 'Simple Slug' }),
    ]

    const locales = getAvailableLocalesForEntry(entries, 'simple-slug')

    expect(locales).toHaveLength(2)
    expect(locales).toContain('es')
    expect(locales).toContain('en')
  })

  test('works with different collections (entries from work)', () => {
    const entries = [
      entry('es/my-work', { title: 'Mi Trabajo' }),
      entry('en/my-work', { title: 'My Work' }),
    ]

    const locales = getAvailableLocalesForEntry(entries, 'my-work')

    expect(locales).toHaveLength(2)
    expect(locales).toContain('es')
    expect(locales).toContain('en')
  })

  test('returns empty array when entries list is empty', () => {
    const locales = getAvailableLocalesForEntry([], 'any-post')

    expect(locales).toHaveLength(0)
  })
})
