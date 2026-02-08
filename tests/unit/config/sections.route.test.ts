import { describe, it, expect } from 'vitest'
import { getSectionRoute, getURLForSection } from '@config/sections'

describe('section route helpers', () => {
  it('getSectionRoute returns correct route for locale', () => {
    expect(getSectionRoute('blog', 'es')).toBe('blog')
    expect(getSectionRoute('talk', 'es')).toBe('charla')
    expect(getSectionRoute('work', 'en')).toBe('work')
  })

  it('getURLForSection builds full url with locale prefix', () => {
    expect(getURLForSection('blog', 'es')).toBe('/es/blog')
    expect(getURLForSection('talk', 'es')).toBe('/es/charla')
    expect(getURLForSection('work', 'en')).toBe('/en/work')
  })
})
