import { test, expect, describe } from 'vitest'
import { buildTagLocaleMap, getAvailableLocaleEntriesFromMap, buildLocaleEntryMap } from '@utils/translationHelpers'
import type { CollectionKey } from 'astro:content'
import type { PostEntry } from '@domain/post'
import { extractCleanId } from '@utils/ids'

// Minimal helper to build fake entries for testing
// Require explicit `translationKey` to reflect real PostEntry usage (no fallbacks)
const entry = (id: string, data: Record<string, unknown> = {}, translationKey: string): PostEntry<CollectionKey> => {
  const { id: cleanId, locale } = extractCleanId(id)
  return ({ id, data, cleanId, translationKey, locale } as unknown) as PostEntry<CollectionKey>
}

// test helper to get the precomputed localeEntryMap quickly
const localeMap = (entries: PostEntry<CollectionKey>[]) => buildLocaleEntryMap(entries)

describe('getAvailableLocaleEntriesFromMap', () => {
  test('returns both locales when entry exists in es and en', () => {
    const entries = [
      entry('es/2025-01-22-my-post', { title: 'Mi Post' }, '2025-01-22-my-post'),
      entry('en/2025-01-22-my-post', { title: 'My Post' }, '2025-01-22-my-post'),
    ]

    const map = buildLocaleEntryMap(entries)
    const result = getAvailableLocaleEntriesFromMap(map, '2025-01-22-my-post')

    expect(Object.keys(result)).toHaveLength(2)
    expect(result['es']).toEqual({ slug: '2025-01-22-my-post', draft: false, canonical: false })
    expect(result['en']).toEqual({ slug: '2025-01-22-my-post', draft: false, canonical: false })
  })


  test.each([
    {
      name: 'only es',
      entries: [
        entry('es/2025-01-22-spanish-only', { title: 'Solo Español' }, '2025-01-22-spanish-only'),
        entry('en/2025-01-22-other-post', { title: 'Other Post' }, '2025-01-22-other-post'),
      ],
      query: '2025-01-22-spanish-only',
      expected: ['es'],
    },
    {
      name: 'only en',
      entries: [
        entry('en/2025-01-22-english-only', { title: 'English Only' }, '2025-01-22-english-only'),
        entry('es/2025-01-22-otro-post', { title: 'Otro Post' }, '2025-01-22-otro-post'),
      ],
      query: '2025-01-22-english-only',
      expected: ['en'],
    },
  ])('returns only expected locales: $name', ({ entries, query, expected }) => {
    const map = buildLocaleEntryMap(entries)
    const result = getAvailableLocaleEntriesFromMap(map, query)
    const keys = Object.keys(result)
    expect(keys).toHaveLength(expected.length)
    expected.forEach(l => expect(result[l as keyof typeof result]).toBeDefined())
  })

  test.each([
    {
      name: 'nonexistent id',
      entries: [
        entry('es/2025-01-22-some-post', { title: 'Algún Post' }, '2025-01-22-some-post'),
        entry('en/2025-01-22-another-post', { title: 'Another Post' }, '2025-01-22-another-post'),
      ],
      query: '2025-01-22-nonexistent',
    },
    {
      name: 'empty list',
      entries: [],
      query: 'any-post',
    },
  ])('returns empty object: $name', ({ entries, query }) => {
    const map = buildLocaleEntryMap(entries)
    const result = getAvailableLocaleEntriesFromMap(map, query)
    expect(Object.keys(result)).toHaveLength(0)
  })

  test('handles entries with nested paths correctly', () => {
    const entries = [
      entry('es/talks/2023-09-27-devcontainers', { title: 'DevContainers' }, 'talks/2023-09-27-devcontainers'),
      entry('en/talks/2023-09-27-devcontainers', { title: 'DevContainers' }, 'talks/2023-09-27-devcontainers'),
    ]

    const map = buildLocaleEntryMap(entries)
    const result = getAvailableLocaleEntriesFromMap(map, 'talks/2023-09-27-devcontainers')

    expect(Object.keys(result)).toHaveLength(2)
    expect(result['es']?.slug).toBe('talks/2023-09-27-devcontainers')
    expect(result['en']?.slug).toBe('talks/2023-09-27-devcontainers')
  })

  test('handles entries without date prefix', () => {
    const entries = [
      entry('es/simple-slug', { title: 'Slug Simple' }, 'simple-slug'),
      entry('en/simple-slug', { title: 'Simple Slug' }, 'simple-slug'),
    ]

    const map = buildLocaleEntryMap(entries)
    const result = getAvailableLocaleEntriesFromMap(map, 'simple-slug')

    expect(Object.keys(result)).toHaveLength(2)
    expect(result['es']?.slug).toBe('simple-slug')
    expect(result['en']?.slug).toBe('simple-slug')
  })

  test('works with different collections (entries from work)', () => {
    const entries = [
      entry('es/my-work', { title: 'Mi Trabajo' }, 'my-work'),
      entry('en/my-work', { title: 'My Work' }, 'my-work'),
    ]

    const map = buildLocaleEntryMap(entries)
    const result = getAvailableLocaleEntriesFromMap(map, 'my-work')

    expect(Object.keys(result)).toHaveLength(2)
    expect(result['es']?.slug).toBe('my-work')
    expect(result['en']?.slug).toBe('my-work')
  })

  test('marks draft entries correctly', () => {
    const entries = [
      entry('es/2025-01-22-my-post', { draft: true }, '2025-01-22-my-post'),
      entry('en/2025-01-22-my-post', { draft: false }, '2025-01-22-my-post'),
    ]

    const map = buildLocaleEntryMap(entries)
    const result = getAvailableLocaleEntriesFromMap(map, '2025-01-22-my-post')

    expect(result['es']?.draft).toBe(true)
    expect(result['en']?.draft).toBe(false)
  })

  test('returns empty object when entries list is empty', () => {
    const map = localeMap([])
    const result = getAvailableLocaleEntriesFromMap(map, 'any-post')

    expect(Object.keys(result)).toHaveLength(0)
  })

  test('matches entries sharing translationKey when cleanIds differ across locales', () => {
    const entries = [
      entry('es/2025-01-01-calendario', { title: 'ES' }, 'shared-id'),
      entry('en/2025-01-01-calendar', { title: 'EN' }, 'shared-id'),
    ]
    const map = buildLocaleEntryMap(entries)
    const result = getAvailableLocaleEntriesFromMap(map, 'shared-id')

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

describe('buildLocaleEntryMap', () => {
  test('throws on duplicate translationKey+locale', () => {
    const entries = [
      entry('es/2025-01-01-a', { title: 'A' }, 'dup-id'),
      entry('es/2025-01-02-b', { title: 'B' }, 'dup-id')
    ]
    expect(() => buildLocaleEntryMap(entries)).toThrow(/Duplicate entry for translationKey "dup-id" and locale "es"/)
  })

  test('precomputes map translationKey -> AvailableLocales', () => {
    const entries = [
      entry('es/alpha', { title: 'A' }, 'alpha'),
      entry('en/alpha', { title: 'A-en' }, 'alpha'),
      entry('es/beta', { title: 'B' }, 'beta')
    ]
    const result = buildLocaleEntryMap(entries)

    expect(result.alpha).toBeDefined()
    expect(result.alpha.es?.slug).toBe('alpha')
    expect(result.alpha.en?.slug).toBe('alpha')
    expect(result.beta.es?.slug).toBe('beta')
    expect(result.beta.en).toBeUndefined()
  })
})
