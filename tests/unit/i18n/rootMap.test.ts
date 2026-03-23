import { describe, it, expect, vi } from 'vitest'

// Mock the sections config used by the module so rootMap is predictable
vi.mock('@domain/section', () => ({
  sectionsConfig: {
    blog: { routes: { en: 'blog', es: 'blog' } },
    talk: { routes: { en: 'talk', es: 'charla' } },
  },
}))

const { rootMap, findCanonicalSectionKey, resolveLocalized } = await import('@i18n/rootMap')

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

  it('findCanonicalSectionKey returns canonical key when slug exists and falls back to raw', () => {
    expect(findCanonicalSectionKey('blog', 'en')).toBe('blog')
    expect(findCanonicalSectionKey('charla', 'es')).toBe('talk')
    expect(findCanonicalSectionKey('acerca-de', 'es')).toBe('about')
    expect(findCanonicalSectionKey('unknown-slug', 'en')).toBe('unknown-slug')
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
