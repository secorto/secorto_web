import { test, expect, describe } from 'vitest'
import {
  buildSectionIndexPathsCore,
  buildAllDetailPathsCore,
} from '@utils/staticPathsBuilder'
import { sectionsConfig } from '@domain/section'
import { getCollection } from 'astro:content'

const blogSection = sectionsConfig['blog']
const workSection = sectionsConfig['work']

describe('integration: staticPathsBuilder with real collections', () => {
  test('buildSectionIndexPathsCore returns expected locales for blog', async () => {
    const result = await buildSectionIndexPathsCore([blogSection], getCollection)
    expect(result.length).toBeGreaterThan(0)
    const locales = result.map(p => p.params.locale)
    expect(locales).toEqual(expect.arrayContaining(['es', 'en']))
  })

  test('buildAllDetailPathsCore produces detail paths with valid ids for blog section', async () => {
    const result = await buildAllDetailPathsCore([blogSection], getCollection)
    expect(result.length).toBeGreaterThan(0)
    for (const path of result.slice(0, 5)) {
      expect(path.props.config.category).toBe('post')
      expect(typeof path.params.id).toBe('string')
      expect(path.props.entry).toBeDefined()
      expect(path.props.config).toBeDefined()
    }
  })

  test('buildAllDetailPathsCore produces detail paths with valid ids for work section', async () => {
    const result = await buildAllDetailPathsCore([workSection], getCollection)
    expect(result.length).toBeGreaterThan(0)
    for (const path of result.slice(0, 5)) {
      expect(path.props.config.category).toBe('experience')
      expect(typeof path.params.id).toBe('string')
      expect(path.props.entry).toBeDefined()
      expect(path.props.config).toBeDefined()
    }
  })
})
