import { describe, expect, it } from 'vitest'
import { createStandalonePageRoutes } from '@secorto/i18n'

describe('createStandalonePageRoutes', () => {
  const locales = {
    getPath: (locale: 'en' | 'es') => `/${locale}`,
  }

  const routes = createStandalonePageRoutes({
    about: {
      en: { route: 'about' },
      es: { route: 'acerca-de' },
    },
    home: {
      en: { route: 'home' },
      es: { route: 'inicio' },
    },
  }, locales)

  it('returns the available pages', () => {
    expect(routes.getPages()).toEqual(['about', 'home'])
  })

  it('returns the localized route for the given page and locale', () => {
    expect(routes.getPageRoute('about', 'es')).toBe('acerca-de')
    expect(routes.getPageRoute('home', 'en')).toBe('home')
  })

  it('throws when the requested page or locale entry does not exist', () => {
    expect(() => {
      // @ts-expect-error locale 'fr' does not exist
      routes.getPageRoute('about', 'fr')
    }).toThrow("Standalone page 'about' has no entry for locale 'fr'.")

    expect(() => {
      // @ts-expect-error page 'missing' does not exist
      routes.getPageRoute('missing', 'en')
    }).toThrow("Standalone page 'missing' has no entry for locale 'en'.")
  })

  it('builds the localized URL from the locale root and page route', () => {
    expect(routes.getPageURL('about', 'es')).toBe('/es/acerca-de')
    expect(routes.getPageURL('home', 'en')).toBe('/en/home')
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
        en: undefined as unknown as { route: string },
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
            en: { route: 'home' },
            es: { route: 'inicio' },
          },
          about: {
            en: { route: 'home' },
            es: { route: 'acerca-de' },
          },
        },
        locales,
      )
    }).toThrow(
      'Route collision detected in StandalonePageRoutes: The slug "home" for locale "en" is duplicated between "home" and "about".',
    )
  })
})
