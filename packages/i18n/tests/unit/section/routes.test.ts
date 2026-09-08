import { describe, it, expect } from 'vitest'
import { createLocales, createSectionRoutes } from '@secorto/i18n'

const locales = createLocales(['es', 'en'] as const)
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

describe('getSectionPath', () => {
  it('builds localized section paths from the locale path resolver', () => {
    expect(locales.getPath('es')).toBe('/es')
    expect(locales.getPath('en')).toBe('/en')

    expect(
      routes.getSectionPath('talk', 'es')
    ).toBe('/es/charla')

    expect(
      routes.getSectionPath('talk', 'en')
    ).toBe('/en/talk')
  })
})

describe('getEntryPath', ()=> {
  it('getEntryPath builds full path for entry with locale prefix', () => {
    expect(routes.getEntryPath('blog', 'es', 'my-post')).toBe('/es/blog/my-post')
    expect(routes.getEntryPath('talk', 'en', 'my-talk')).toBe('/en/talk/my-talk')
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

describe('getEntryPathFromId', () => {
  it('builds a path from a localized entry id', () => {
    expect(
      routes.getEntryPathFromId(
        'blog',
        'es',
        'es/mi-post'
      )
    ).toBe('/es/blog/mi-post')
  })

  it('supports nested paths', () => {
    expect(
      routes.getEntryPathFromId(
        'blog',
        'es',
        'es/category/my-post'
      )
    ).toBe('/es/blog/category/my-post')
  })

  it('throws when entry locale and requested locale do not match', () => {
    expect(() =>
      routes.getEntryPathFromId(
        'blog',
        'en',
        'es/mi-post'
      )
    ).toThrow('Locale mismatch')
  })

  it('propagates invalid entry id errors', () => {
    expect(() =>
      routes.getEntryPathFromId(
        'blog',
        'es',
        'mi-post'
      )
    ).toThrow('Invalid entryId')
  })
})
