import { test, expect, describe, vi } from 'vitest'
import {
  buildAllDetailPathsCore,
  buildSectionIndexPathsCore,
  buildLocalePathsForSection,
  buildTagPathsCore,
  buildTagIndexPathsCore,
  type FetchCollection
} from '@utils/staticPathsBuilder'
import type { CollectionEntry, CollectionKey } from 'astro:content'
import { sectionsConfig, type SectionConfig } from '@domain/section'
import {
  createPostEntries,
  createCollectionEntry,
} from './staticPathsBuilder.fixtures'
import { languageKeys } from '@i18n/ui'

const blogSection = sectionsConfig['blog']
const onlyBlogSections = [blogSection]
const emptySections: SectionConfig[] = []

describe('buildAllDetailPathsCore', () => {
  test('handles empty collections gracefully', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => [] as CollectionEntry<CollectionKey>[])
    const result = await buildAllDetailPathsCore(onlyBlogSections, mockGetCollection)
    expect(result).toEqual([])
  })

  test('lanza error si un entry no está bajo una carpeta de locale válida', async () => {
    const invalidEntry = createCollectionEntry('blog', { id: 'orphan/my-post' })
    const mockGetCollection: FetchCollection = vi.fn(async () => [invalidEntry])
    await expect(buildAllDetailPathsCore(onlyBlogSections, mockGetCollection))
      .rejects.toThrow('Unknown locale prefix "orphan" in entryId "orphan/my-post"')
  })
})

describe('buildLocalePathsForSection', () => {
  const postEntries = createPostEntries('blog', 4, { tags: ['ts'] }, 'post')

  test('rama post: filtra entradas por locale correctamente', () => {
    const result = buildLocalePathsForSection(blogSection, postEntries)
    const esPath = result.find(p => p.params.locale === 'es')
    const enPath = result.find(p => p.params.locale === 'en')
    expect(esPath?.props.posts).toHaveLength(2)
    expect(enPath?.props.posts).toHaveLength(2)
  })

  test('extrae tags desde los posts del locale correspondiente', () => {
    const result = buildLocalePathsForSection(blogSection, postEntries)
    const esPath = result.find(p => p.params.locale === 'es')
    expect(esPath?.props.tags).toContain('ts')
  })

  test('collection vacía produce arrays de posts y tags vacíos', () => {
    const result = buildLocalePathsForSection(blogSection, [])
    for (const path of result) {
      expect(path.props.posts).toHaveLength(0)
      expect(path.props.tags).toHaveLength(0)
    }
  })
})

describe('buildSectionIndexPathsCore', () => {
  test('handles empty sections', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => [])
    const result = await buildSectionIndexPathsCore(emptySections, mockGetCollection)
    expect(result).toEqual([])
  })
})

describe('buildTagPathsCore', () => {
  test('includes tag in params', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => [
      createPostEntries('blog', 1, { tags: ['typescript'] })[0]
    ])
    const result = await buildTagPathsCore(onlyBlogSections, mockGetCollection)
    for (const path of result) {
      expect(path.params.tag).toBeDefined()
    }
  })

  test('includes allEntries and config in props', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => [
      createPostEntries('blog', 1, { tags: ['typescript'] })[0]
    ])

    const result = await buildTagPathsCore(onlyBlogSections, mockGetCollection)
    expect(result.length).toBeGreaterThan(0)
    for (const path of result) {
      expect(Array.isArray(path.props.allEntries)).toBe(true)
      expect(path.props.config).toBeDefined()
    }
  })

  test('returns empty when no posts have tags', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => [
      createPostEntries('blog', 1, { tags: [] })[0]
    ])
    const result = await buildTagPathsCore(onlyBlogSections, mockGetCollection)
    expect(result).toEqual([])
  })

  test('handles empty sections', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => [])
    const result = await buildTagPathsCore(emptySections, mockGetCollection)
    expect(result).toEqual([])
  })
})

describe('buildTagIndexPathsCore', () => {
  test('handles empty sections gracefully', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => [])
    const result = await buildTagIndexPathsCore(emptySections, mockGetCollection)
    expect(result).toHaveLength(languageKeys.length) // 2 locales, but no collections
    for (const path of result) {
      expect(path.props.allSectionEntries).toEqual({})
    }
  })
})
