import { describe, it, expect } from 'vitest'
import { getSectionRoute, getURLForSection, getEntryURL, getEntryTagURL } from '@domain/section'

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

  it('getEntryURL builds full url for entry with locale prefix', () => {
    expect(getEntryURL('blog', 'es', 'my-post')).toBe('/es/blog/my-post')
    expect(getEntryURL('talk', 'en', 'my-talk')).toBe('/en/talk/my-talk')
  })

  it('getEntryTagURL builds full url for tag with locale prefix', () => {
    expect(getEntryTagURL('blog', 'es', 'my-tag')).toBe('/es/blog/tags/my-tag')
    expect(getEntryTagURL('talk', 'en', 'my-tag')).toBe('/en/talk/tags/my-tag')
  })
})
