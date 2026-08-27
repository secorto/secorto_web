import { describe, it, expect } from 'vitest'
import { createSectionRoutes } from '@secorto/i18n'

const routes = createSectionRoutes({
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
      routes.getSectionURL('talk', 'es')
    ).toBe('/es/charla')

    expect(
      routes.getSectionURL('talk', 'en')
    ).toBe('/en/talk')
  })
})

describe('getEntryURL', ()=> {
  it('getEntryURL builds full url for entry with locale prefix', () => {
    expect(routes.getEntryURL('blog', 'es', 'my-post')).toBe('/es/blog/my-post')
    expect(routes.getEntryURL('talk', 'en', 'my-talk')).toBe('/en/talk/my-talk')
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
      createSectionRoutes(duplicateRoutes)
    }).toThrow(
      'Duplicated route for locale "es" and slug "blog" between sections "blog" and "talk".'
    )
  })
})
