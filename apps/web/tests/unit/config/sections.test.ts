import { describe, it, expect } from 'vitest'
import { getSectionConfigByCollection, getSectionConfigByRoute } from '@utils/sections'
import { sectionsConfig } from '@domain/section'

describe('sections config helpers', () => {
  it('getSectionConfigByCollection returns config for known collection', () => {
    const cfg = getSectionConfigByCollection('blog')
    expect(cfg.name).toBe('blog')
    expect(cfg.routes.es).toBe('blog')
  })

  it('getSectionConfigByCollection throws when collection is unknown', () => {
    // @ts-expect-error testing error case
    expect(() => getSectionConfigByCollection('nonexistent'))
      .toThrow('Section config not found')
  })

  it('getSectionConfigByRoute returns config for known route', () => {
    const cfg = getSectionConfigByRoute('blog', 'es')
    expect(cfg.name).toBe('blog')
  })
})

describe('sections config category', () => {
  it('blog uses post category', () => {
    expect(sectionsConfig.blog.category).toBe('post')
  })

  it('talk uses post category', () => {
    expect(sectionsConfig.talk.category).toBe('post')
  })

  it('work uses experience category', () => {
    expect(sectionsConfig.work.category).toBe('experience')
  })

  it('projects uses experience category', () => {
    expect(sectionsConfig.projects.category).toBe('experience')
  })

  it('community uses experience category', () => {
    expect(sectionsConfig.community.category).toBe('experience')
  })

  it('all sections have category defined', () => {
    Object.values(sectionsConfig).forEach(config => {
      expect(config.category).toBeDefined()
      expect(['post', 'experience']).toContain(config.category)
    })
  })
})
