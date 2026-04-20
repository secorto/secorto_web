import { test, expect, describe } from 'vitest'
import { buildTagIndexPathsCore } from '@utils/staticPathsBuilder'
import { sectionsConfig } from '@domain/section'
import { getCollection } from 'astro:content'

describe('integration: tags index behavior with real collections', () => {
  test('caches entries by collection', async () => {
    const result = await buildTagIndexPathsCore([sectionsConfig['blog'], sectionsConfig['talk']], getCollection)
    // Each route should have allSectionEntries with both collections
    for (const path of result) {
      expect(path.props.allSectionEntries).toHaveProperty('blog')
      expect(path.props.allSectionEntries).toHaveProperty('talk')
      expect(Array.isArray(path.props.allSectionEntries.blog)).toBe(true)
      expect(path.props.allSectionEntries.blog.length).toBeGreaterThan(0) // Assuming there are blog entries
      expect(Array.isArray(path.props.allSectionEntries.talk)).toBe(true)
      expect(path.props.allSectionEntries.talk.length).toBeGreaterThan(0) // Assuming there are talk entries
    }
  })
})
