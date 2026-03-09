import { test, expect, describe } from 'vitest'
import { getAvailableLocaleEntries, buildTagLocaleMap } from '@utils/translationHelpers'
import type { CollectionKey } from 'astro:content'
import type { PostEntry } from '@domain/post'

// Minimal helper to build fake entries for testing
// Require explicit `canonicalId` to reflect real PostEntry usage
const entry = (id: string, data: Record<string, unknown> = {}, canonicalId: string): PostEntry<CollectionKey> => {
  const cleanId = id.replace(/^[^/]+\//, '')
  return ({ id, data, cleanId, canonicalId } as unknown) as PostEntry<CollectionKey>
}

describe('getAvailableLocaleEntries', () => {
  test('returns both locales when entry exists in es and en', () => {
    const entries = [
      entry('es/2025-01-22-my-post', { title: 'Mi Post' }, '2025-01-22-my-post'),
      entry('en/2025-01-22-my-post', { title: 'My Post' }, '2025-01-22-my-post'),
    ]

    const result = getAvailableLocaleEntries(entries, '2025-01-22-my-post')

    expect(Object.keys(result)).toHaveLength(2)
    expect(result['es']).toEqual({ slug: '2025-01-22-my-post', draft: false, canonical: false })
    expect(result['en']).toEqual({ slug: '2025-01-22-my-post', draft: false, canonical: false })
  })

  test('returns only es when entry exists only in Spanish', () => {
    const entries = [
      entry('es/2025-01-22-spanish-only', { title: 'Solo Español' }, '2025-01-22-spanish-only'),
      entry('en/2025-01-22-other-post', { title: 'Other Post' }, '2025-01-22-other-post'),
    ]

    const result = getAvailableLocaleEntries(entries, '2025-01-22-spanish-only')

    expect(Object.keys(result)).toHaveLength(1)
    expect(result['es']).toBeDefined()
    expect(result['en']).toBeUndefined()
  })

  test('returns only en when entry exists only in English', () => {
    const entries = [
      entry('en/2025-01-22-english-only', { title: 'English Only' }, '2025-01-22-english-only'),
      entry('es/2025-01-22-otro-post', { title: 'Otro Post' }, '2025-01-22-otro-post'),
    ]

    const result = getAvailableLocaleEntries(entries, '2025-01-22-english-only')

    expect(Object.keys(result)).toHaveLength(1)
    expect(result['en']).toBeDefined()
    expect(result['es']).toBeUndefined()
  })

  test('returns empty object when entry does not exist in any locale', () => {
    const entries = [
      entry('es/2025-01-22-some-post', { title: 'Algún Post' }, '2025-01-22-some-post'),
      entry('en/2025-01-22-another-post', { title: 'Another Post' }, '2025-01-22-another-post'),
    ]

    const result = getAvailableLocaleEntries(entries, '2025-01-22-nonexistent')

    expect(Object.keys(result)).toHaveLength(0)
  })

  test('handles entries with nested paths correctly', () => {
    const entries = [
      entry('es/talks/2023-09-27-devcontainers', { title: 'DevContainers' }, 'talks/2023-09-27-devcontainers'),
      entry('en/talks/2023-09-27-devcontainers', { title: 'DevContainers' }, 'talks/2023-09-27-devcontainers'),
    ]

    const result = getAvailableLocaleEntries(entries, 'talks/2023-09-27-devcontainers')

    expect(Object.keys(result)).toHaveLength(2)
    expect(result['es']?.slug).toBe('talks/2023-09-27-devcontainers')
    expect(result['en']?.slug).toBe('talks/2023-09-27-devcontainers')
  })

  test('handles entries without date prefix', () => {
    const entries = [
      entry('es/simple-slug', { title: 'Slug Simple' }, 'simple-slug'),
      entry('en/simple-slug', { title: 'Simple Slug' }, 'simple-slug'),
    ]

    const result = getAvailableLocaleEntries(entries, 'simple-slug')

    expect(Object.keys(result)).toHaveLength(2)
    expect(result['es']?.slug).toBe('simple-slug')
    expect(result['en']?.slug).toBe('simple-slug')
  })

  test('works with different collections (entries from work)', () => {
    const entries = [
      entry('es/my-work', { title: 'Mi Trabajo' }, 'my-work'),
      entry('en/my-work', { title: 'My Work' }, 'my-work'),
    ]

    const result = getAvailableLocaleEntries(entries, 'my-work')

    expect(Object.keys(result)).toHaveLength(2)
    expect(result['es']?.slug).toBe('my-work')
    expect(result['en']?.slug).toBe('my-work')
  })

  test('marks draft entries correctly', () => {
    const entries = [
      entry('es/2025-01-22-my-post', { draft: true }, '2025-01-22-my-post'),
      entry('en/2025-01-22-my-post', { draft: false }, '2025-01-22-my-post'),
    ]

    const result = getAvailableLocaleEntries(entries, '2025-01-22-my-post')

    expect(result['es']?.draft).toBe(true)
    expect(result['en']?.draft).toBe(false)
  })

  test('returns empty object when entries list is empty', () => {
    const result = getAvailableLocaleEntries([], 'any-post')

    expect(Object.keys(result)).toHaveLength(0)
  })

  test('matches entries sharing postId when cleanIds differ across locales', () => {
    const entries = [
      entry('es/2025-01-01-calendario', { title: 'ES' }, 'shared-id'),
      entry('en/2025-01-01-calendar', { title: 'EN' }, 'shared-id'),
    ]

    // entries share canonicalId 'shared-id' so we query by canonicalId 'shared-id'
    const result = getAvailableLocaleEntries(entries, 'shared-id')

    expect(Object.keys(result)).toHaveLength(2)
    expect(result['es']?.slug).toBe('2025-01-01-calendario')
    expect(result['en']?.slug).toBe('2025-01-01-calendar')
  })
})

describe('buildTagLocaleMap', () => {
  test('maps each tag to the locales that have it', () => {
    const entries = [
      entry('es/post-1', { tags: ['linux', 'python'] }, 'post-1'),
      entry('en/post-1', { tags: ['linux'] }, 'post-1'),
    ]
    const map = buildTagLocaleMap(entries)
    expect(map['linux']).toEqual({ es: 'linux', en: 'linux' })
    expect(map['python']).toEqual({ es: 'python' })
  })

  test('excludes draft entries', () => {
    const entries = [
      entry('en/draft', { tags: ['testing'], draft: true }, 'draft'),
      entry('es/pub', { tags: ['testing'] }, 'pub'),
    ]
    const map = buildTagLocaleMap(entries)
    expect(map['testing']).toEqual({ es: 'testing' })
  })

  test('with tagMap: groups translated slugs under canonical, indexes by both slugs', () => {
    const entries = [
      entry('es/post', { tags: ['herramientas'] }, 'post'),
      entry('en/post', { tags: ['tools'] }, 'post'),
    ]
    const tagMap = { tools: { en: 'tools', es: 'herramientas' } }
    const map = buildTagLocaleMap(entries, tagMap)

    // both slugs resolve to the same data
    expect(map['tools']).toEqual({ en: 'tools', es: 'herramientas' })
    expect(map['herramientas']).toEqual({ en: 'tools', es: 'herramientas' })
  })

  test('with tagMap: only marks locale available if content actually exists', () => {
    const entries = [
      entry('es/post', { tags: ['herramientas'] }, 'post'),
      // no en entry with 'tools'
    ]
    const tagMap = { tools: { en: 'tools', es: 'herramientas' } }
    const map = buildTagLocaleMap(entries, tagMap)

    expect(map['herramientas']).toEqual({ es: 'herramientas' })
    expect(map['herramientas']['en']).toBeUndefined()
  })

  test('without tagMap: same-name tags across locales are independent entries', () => {
    const entries = [
      entry('es/p', { tags: ['python'] }, 'p'),
      entry('en/p', { tags: ['python'] }, 'p'),
    ]
    const map = buildTagLocaleMap(entries)
    expect(map['python']).toEqual({ es: 'python', en: 'python' })
  })

  test('returns empty map for empty entries', () => {
    expect(buildTagLocaleMap([])).toEqual({})
  })
})
