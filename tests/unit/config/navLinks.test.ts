import { describe, it, expect } from 'vitest'
import { NAV_LINKS } from '@config/navLinks'
import { rootMap } from '@i18n/rootMap'
import { ui } from '@i18n/ui'

describe('navLinks', () => {
  it('NAV_LINKS is a non-empty array', () => {
    expect(Array.isArray(NAV_LINKS)).toBe(true)
    expect(NAV_LINKS.length).toBeGreaterThan(0)
  })

  it('each entry has routeKey and translationKey', () => {
    for (const link of NAV_LINKS) {
      expect(link).toHaveProperty('routeKey')
      expect(link).toHaveProperty('translationKey')
      expect(typeof link.routeKey).toBe('string')
      expect(typeof link.translationKey).toBe('string')
    }
  })

  it('every routeKey exists in rootMap', () => {
    const validRoutes = Object.keys(rootMap)
    for (const link of NAV_LINKS) {
      expect(validRoutes).toContain(link.routeKey)
    }
  })

  it('every translationKey exists in ui.en', () => {
    const validKeys = Object.keys(ui.en)
    for (const link of NAV_LINKS) {
      expect(validKeys).toContain(link.translationKey)
    }
  })

  it('contains expected navigation items', () => {
    const routeKeys = NAV_LINKS.map(l => l.routeKey)
    expect(routeKeys).toContain('blog')
    expect(routeKeys).toContain('talk')
    expect(routeKeys).toContain('about')
  })
})
