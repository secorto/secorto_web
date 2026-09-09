import { describe, expect, it } from 'vitest'
import { createStandalonePageRoutes } from '@secorto/i18n'

describe('createStandalonePageRoutes', () => {
  const locales = {
    getPath: (locale: 'en' | 'es') => `/${locale}`,
  }

  const routes = createStandalonePageRoutes({
    about: {
      en: { slug: 'about' },
      es: { slug: 'acerca-de' },
    },
    home: {
      en: { slug: 'home' },
      es: { slug: 'inicio' },
    },
  }, locales)

  it('returns the available pages', () => {
    expect(routes.getPages()).toEqual(['about', 'home'])
  })

  it('resolves a registered page key from a raw string', () => {
    expect(routes.getPage('about')).toBe('about')
    expect(routes.getPage('home')).toBe('home')
  })

  it('throws when a page key is not indexed', () => {
    expect(() => {
      routes.getPage('missing')
    }).toThrow("Standalone page 'missing' is not indexed.")
  })

  it('returns the localized slug for the given page and locale', () => {
    expect(routes.getPageSlug('about', 'es')).toBe('acerca-de')
    expect(routes.getPageSlug('home', 'en')).toBe('home')
  })

  it('throws when the requested page or locale entry does not exist', () => {
    expect(() => {
      // @ts-expect-error locale 'fr' does not exist
      routes.getPageSlug('about', 'fr')
    }).toThrow("Standalone page 'about' has no entry for locale 'fr'.")

    expect(() => {
      // @ts-expect-error page 'missing' does not exist
      routes.getPageSlug('missing', 'en')
    }).toThrow("Standalone page 'missing' has no entry for locale 'en'.")
  })

  it('builds the localized path from the locale root and page slug', () => {
    expect(routes.getPagePath('about', 'es')).toBe('/es/acerca-de')
    expect(routes.getPagePath('home', 'en')).toBe('/en/home')
  })

  it('throws when a page has no localized entries defined', () => {
    const invalidRoutes = {
      home: {},
    }

    expect(() => {
      createStandalonePageRoutes(invalidRoutes, locales)
    }).toThrow("Standalone page 'home' has no localized entries.")
  })

  it('throws when a locale entry is explicitly nullish', () => {
    const invalidRoutes = {
      home: {
        en: undefined as unknown as { slug: string },
      },
    }

    expect(() => {
      createStandalonePageRoutes(invalidRoutes, locales)
    }).toThrow("Standalone page 'home' has no entry for locale 'en'.")
  })

  it('throws when a page entry is explicitly undefined', () => {
    const invalidRoutes = {
      home: undefined,
    }

    expect(() => {
      // @ts-expect-error page entry must always contain localized routes by contract
      createStandalonePageRoutes(invalidRoutes, locales)
    }).toThrow("Standalone page 'home' has no localized entries.")
  })

  it('throws when duplicate localized routes are found across pages', () => {
    expect(() => {
      createStandalonePageRoutes(
        {
          home: {
            en: { slug: 'home' },
            es: { slug: 'inicio' },
          },
          about: {
            en: { slug: 'home' },
            es: { slug: 'acerca-de' },
          },
        },
        locales,
      )
    }).toThrow(
      'Slug collision detected in StandalonePageRoutes: The slug "home" for locale "en" is duplicated between "home" and "about".',
    )
  })
})
