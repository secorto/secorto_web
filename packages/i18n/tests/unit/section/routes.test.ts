import { describe, it, expect } from 'vitest'
import { createSectionRoutes } from '@secorto/i18n'

const locales = {
  getPath: (locale: 'es' | 'en') => `/${locale}`,
}

const routes = createSectionRoutes({
  blog: {
    es: 'blog',
    en: 'blog'
  },
  talk: {
    es: 'charla',
    en: 'talk'
  }
}, locales)

describe('getSectionURL', () => {
  it('builds localized section urls from the locale path resolver', () => {
    expect(locales.getPath('es')).toBe('/es')
    expect(locales.getPath('en')).toBe('/en')

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
      createSectionRoutes(duplicateRoutes, locales)
    }).toThrow(
      'Route collision detected in SectionRoutes: The slug "blog" for locale "es" is duplicated between "blog" and "talk".'
    )
  })
})
