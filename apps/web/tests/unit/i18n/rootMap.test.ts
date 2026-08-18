import { describe, it, expect, vi } from 'vitest'

// Mock the sections config used by the module so rootMap is predictable
vi.mock('@domain/section', () => ({
  sectionsConfig: {
    blog: { routes: { en: 'blog', es: 'blog' } },
    talk: { routes: { en: 'talk', es: 'charla' } },
  },
}))

const { findSectionMap, resolveLocalized } = await import('@i18n/rootMap')

describe('i18n rootMap', () => {
  it('findSectionMap returns sectionMap when slug exists, undefined otherwise', () => {
    expect(findSectionMap('blog', 'en')).toEqual({ en: 'blog', es: 'blog' })
    expect(findSectionMap('charla', 'es')).toEqual({ en: 'talk', es: 'charla' })
    expect(findSectionMap('acerca-de', 'es')).toEqual({ en: 'about', es: 'acerca-de' })
    expect(findSectionMap('unknown-slug', 'en')).toBeUndefined()
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
