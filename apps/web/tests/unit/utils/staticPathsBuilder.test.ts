import { test, expect, describe, vi } from 'vitest'
import {
  buildTagPathsCore,
  type FetchCollection
} from '@utils/staticPathsBuilder'
import { sectionsConfig, type SectionConfig } from '@domain/section'
import {
  createPostEntries,
} from './staticPathsBuilder.fixtures'

const blogSection = sectionsConfig['blog']
const talkSection = sectionsConfig['talk']
const onlyBlogSections = [blogSection]
const blogAndTalkSections = [blogSection, talkSection]
const emptySections: SectionConfig[] = []

describe('buildTagPathsCore', () => {
  test('generates tag paths for provided sections', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => [
      createPostEntries('blog', 1, { tags: ['typescript', 'astro'] })[0],
      createPostEntries('blog', 1, { id: 'en/post-1', tags: ['testing'] })[0]
    ])

    const result = await buildTagPathsCore(blogAndTalkSections, mockGetCollection)

    // Should have multiple tags across sections and locales
    expect(result.length).toBeGreaterThan(0)
  })

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

  test('deduplicates tags within the same locale', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => [
      createPostEntries('blog', 1, { tags: ['astro', 'astro', 'ts'] })[0],
      createPostEntries('blog', 1, { id: 'es/post-2', tags: ['ts'] })[0],
      createPostEntries('blog', 1, { id: 'en/post-1', tags: ['astro', 'astro', 'ts'] })[0],
      createPostEntries('blog', 1, { id: 'en/post-2', tags: ['ts'] })[0]
    ])
    const result = await buildTagPathsCore(onlyBlogSections, mockGetCollection)
    // Should not have duplicate tags per locale
    const esTags = result
      .filter(p => p.params.locale === 'es')
      .map(p => p.params.tag)
    const enTags = result
      .filter(p => p.params.locale === 'en')
      .map(p => p.params.tag)

    expect(new Set(esTags).size).toBe(esTags.length)
    expect(new Set(enTags).size).toBe(enTags.length)
  })

  test('handles empty sections', async () => {
    const mockGetCollection: FetchCollection = vi.fn(async () => [])
    const result = await buildTagPathsCore(emptySections, mockGetCollection)
    expect(result).toEqual([])
  })
})
