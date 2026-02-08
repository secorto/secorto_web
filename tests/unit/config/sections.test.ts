import { describe, it, expect } from 'vitest'
import { getSectionConfigByCollection, getSectionConfigByRoute } from '@config/sections'

describe('sections config helpers', () => {
  it('getSectionConfigByCollection returns config for known collection', () => {
    const cfg = getSectionConfigByCollection('blog')
    expect(cfg).not.toBeNull()
    expect(cfg!.collection).toBe('blog')
    expect(cfg!.routes.es).toBe('blog')
  })

  it('getSectionConfigByCollection returns null for unknown collection', () => {
    // @ts-expect-error: testing unknown collection
    const cfg = getSectionConfigByCollection('nonexistent')
    expect(cfg).toBeNull()
  })

  it('getSectionConfigByRoute returns config for known route', () => {
    const cfg = getSectionConfigByRoute('blog', 'es')
    expect(cfg).not.toBeNull()
    expect(cfg!.collection).toBe('blog')
  })

  it('getSectionConfigByRoute returns null for unknown route', () => {
    const cfg = getSectionConfigByRoute('nope', 'es')
    expect(cfg).toBeNull()
  })
})
