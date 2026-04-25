import { test, expect, describe } from 'vitest'
import { buildSectionIndexPathsCore, buildTagPathsCore } from '@utils/staticPathsBuilder'
import { sectionsConfig } from '@domain/section'
import { getCollection } from 'astro:content'

const blogSection = sectionsConfig['blog']

describe('integration: tags behavior with real collections', () => {
  test('buildSectionIndexPathsCore extracts tags from posts', async () => {
    const result = await buildSectionIndexPathsCore([blogSection], getCollection)
    const esPath = result.find(p => p.params.locale === 'es')
    expect(esPath).toBeDefined()
    // tags must be an array (may be empty depending on content)
    expect(Array.isArray(esPath?.props.tags)).toBe(true)
  })

  test('buildTagPathsCore generates tag paths and deduplicates per locale', async () => {
    const result = await buildTagPathsCore([blogSection], getCollection)
    // Should have zero or more tag paths; ensure params and deduplication structure
    for (const path of result) {
      expect(path.params.tag).toBeDefined()
      expect(path.params.locale).toBeDefined()
    }

    const esTags = result.filter(p => p.params.locale === 'es').map(p => p.params.tag)
    const enTags = result.filter(p => p.params.locale === 'en').map(p => p.params.tag)
    expect(new Set(esTags).size).toBe(esTags.length)
    expect(new Set(enTags).size).toBe(enTags.length)
  })
})
