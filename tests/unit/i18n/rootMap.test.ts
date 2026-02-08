import { describe, it, expect, vi } from 'vitest'

// Mock the sections config used by the module so rootMap is predictable
vi.mock('@config/sections', () => ({
  sectionsConfig: {
    blog: { routes: { en: 'blog', es: 'blog' } },
    talk: { routes: { en: 'talk', es: 'charla' } },
  },
}))

const { rootMap, resolveCanonical, resolveLocalized } = await import('../../../src/i18n/rootMap')

describe('i18n rootMap', () => {
  it('builds rootMap including extraRoutes', () => {
    // from mocked sectionsConfig + extraRoutes (about)
    expect(rootMap).toHaveProperty('blog')
    expect(rootMap).toHaveProperty('talk')
    expect(rootMap).toHaveProperty('about')

    expect(rootMap.blog.en).toBe('blog')
    expect(rootMap.talk.es).toBe('charla')
    expect(rootMap.about.es).toBe('acerca-de')
  })

  it('resolveCanonical returns canonical key when slug exists', () => {
    expect(resolveCanonical('blog', 'en')).toBe('blog')
    expect(resolveCanonical('charla', 'es')).toBe('talk')
    expect(resolveCanonical('acerca-de', 'es')).toBe('about')
  })

  it('resolveCanonical falls back to raw when not found', () => {
    expect(resolveCanonical('unknown-slug', 'en')).toBe('unknown-slug')
  })

  it('resolveLocalized returns localized slug for canonical key', () => {
    expect(resolveLocalized('blog', 'es')).toBe('blog')
    expect(resolveLocalized('talk', 'en')).toBe('talk')
    expect(resolveLocalized('about', 'es')).toBe('acerca-de')
  })

  it('resolveLocalized falls back to canonical when missing', () => {
    expect(resolveLocalized('nonexistent', 'en')).toBe('nonexistent')
  })
})
