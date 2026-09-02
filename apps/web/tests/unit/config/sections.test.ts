import { describe, it, expect } from 'vitest'
import { sectionsConfig } from '@domain/section'


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
