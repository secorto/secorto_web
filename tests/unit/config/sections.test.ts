import { describe, it, expect } from 'vitest'
import { getSectionConfigByCollection, getSectionConfigByRoute, sectionsConfig } from '@config/sections'

describe('sections config helpers', () => {
  it('getSectionConfigByCollection returns config for known collection', () => {
    const cfg = getSectionConfigByCollection('blog')
    expect(cfg.collection).toBe('blog')
    expect(cfg.routes.es).toBe('blog')
  })

  it('getSectionConfigByCollection throws when collection is unknown', () => {
    // @ts-expect-error testing error case
    expect(() => getSectionConfigByCollection('nonexistent'))
      .toThrow('Section config not found')
  })

  it('getSectionConfigByRoute returns config for known route', () => {
    const cfg = getSectionConfigByRoute('blog', 'es')
    expect(cfg.collection).toBe('blog')
  })
})

describe('sections config detailComponent', () => {
  it('blog uses BlogTalkPostView', () => {
    expect(sectionsConfig.blog.detailComponent).toBe('BlogTalkPostView')
  })

  it('talk uses BlogTalkPostView', () => {
    expect(sectionsConfig.talk.detailComponent).toBe('BlogTalkPostView')
  })

  it('work uses WorkProjectCommunityView', () => {
    expect(sectionsConfig.work.detailComponent).toBe('WorkProjectCommunityView')
  })

  it('project uses WorkProjectCommunityView', () => {
    expect(sectionsConfig.project.detailComponent).toBe('WorkProjectCommunityView')
  })

  it('community uses WorkProjectCommunityView', () => {
    expect(sectionsConfig.community.detailComponent).toBe('WorkProjectCommunityView')
  })

  it('all sections have detailComponent defined', () => {
    Object.values(sectionsConfig).forEach(config => {
      expect(config.detailComponent).toBeDefined()
      expect(['BlogTalkPostView', 'WorkProjectCommunityView']).toContain(config.detailComponent)
    })
  })
})
