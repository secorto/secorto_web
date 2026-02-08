import { describe, it, expect } from 'vitest'
import { getSectionConfigByCollection, getSectionConfigByRoute } from '@config/sections'

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
