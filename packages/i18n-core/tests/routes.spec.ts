import { describe, it, expect } from 'vitest'
import { getEntryURL, getSectionURL, sectionRoutes } from '@secorto/i18n-core'

const routes = sectionRoutes({
  blog: {
    es: 'blog',
    en: 'blog'
  },
  talk: {
    es: 'charla',
    en: 'talk'
  }
})

describe('getSectionURL', () => {
  it('builds localized section urls', () => {
    expect(
      getSectionURL(routes, 'talk', 'es')
    ).toBe('/es/charla')

    expect(
      getSectionURL(routes, 'talk', 'en')
    ).toBe('/en/talk')
  })
})

describe('getEntryURL', ()=> {
  it('getEntryURL builds full url for entry with locale prefix', () => {
    expect(getEntryURL(routes, 'blog', 'es', 'my-post')).toBe('/es/blog/my-post')
    expect(getEntryURL(routes, 'talk', 'en', 'my-talk')).toBe('/en/talk/my-talk')
  })
})

describe('sectionRoutes', () => {
  it('throws an error when duplicate routes are found', () => {
    const duplicateRoutes = {
      blog: {
        es: 'blog',
        en: 'blog'
      },
      talk: {
        es: 'blog', // Duplicate route for 'es'
        en: 'talk'
      }
    }

    expect(() => {
      sectionRoutes(duplicateRoutes)
    }).toThrow(
      'Duplicated route for locale "es" and slug "blog" between sections "blog" and "talk".'
    )
  })
})
