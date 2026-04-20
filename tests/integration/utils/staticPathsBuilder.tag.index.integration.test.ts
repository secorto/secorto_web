import { test, expect, describe } from 'vitest'
import { buildTagIndexPathsCore } from '@utils/staticPathsBuilder'
import { sectionsConfig } from '@domain/section'
import { getCollection } from 'astro:content'
import { languageKeys } from '@i18n/ui'

describe('integration: tags index behavior with real collections', () => {
  test('builds tag index paths correctly', async () => {
    const result = await buildTagIndexPathsCore([sectionsConfig['blog'], sectionsConfig['talk']], getCollection)
    // Each route should have allSectionEntries with both collections
    expect(result).toHaveLength(languageKeys.length)
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
