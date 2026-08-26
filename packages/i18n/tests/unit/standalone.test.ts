import { describe, expect, it } from 'vitest'

import { createLocales, createStandalonePageLinks } from '@secorto/i18n'

const locales = createLocales(['en', 'es', 'fr'])

describe('createStandalonePageLinks', () => {

  const index = {
    home: {
      en: { route: 'home' },
      es: { route: 'inicio' },
      fr: { route: 'accueil' },
    },
  }

  it('throws when translation key is not indexed', () => {
    expect(() =>
      createStandalonePageLinks(
        new URL('https://example.com/en/home'),
        'unknown',
        index,
        locales,
      ),
    ).toThrow(
      "Standalone page 'unknown' is not indexed.",
    )
  })

  it('throws when current locale has no entry', () => {
    const customIndex = {
      home: {
        en: { route: 'home' },
        es: { route: 'inicio' },
      },
    }

    expect(() =>
      createStandalonePageLinks(
        new URL('https://example.com/fr/accueil'),
        'home',
        customIndex,
        locales,
      ),
    ).toThrow(
      "Standalone page 'home' has no entry for locale 'fr'.",
    )
  })

  it('throws when current route does not belong to the translation group', () => {
    expect(() =>
      createStandalonePageLinks(
        new URL('https://example.com/en/wrong-route'),
        'home',
        index,
        locales,
      ),
    ).toThrow(
      "Route '/en/wrong-route' does not belong to standalone page 'home'.",
    )
  })

  it('returns links for all available locales', () => {
    const result = createStandalonePageLinks(
      new URL('https://example.com/en/home'),
      'home',
      index,
      locales,
    )

    expect(result).toHaveLength(3)

    expect(result).toEqual([
      expect.objectContaining({
        href: '/en/home',
        locale: 'en',
      }),
      expect.objectContaining({
        href: '/es/inicio',
        locale: 'es',
      }),
      expect.objectContaining({
        href: '/fr/accueil',
        locale: 'fr',
      }),
    ])
  })

  it('returns a draft link when the locale entry is marked as draft', () => {
    const customIndex = {
      home: {
        en: { route: 'home' },
        es: {
          route: 'inicio',
          draft: true,
        },
      },
    }

    const result = createStandalonePageLinks(
      new URL('https://example.com/en/home'),
      'home',
      customIndex,
      locales,
    )

    expect(result).toContainEqual(
      expect.objectContaining({
        href: '/es/inicio',
        locale: 'es',
      }),
    )
  })

  it('returns a missing link when a locale entry does not exist', () => {
    const customIndex = {
      home: {
        en: { route: 'home' },
        es: { route: 'inicio' },
      },
    }

    const result = createStandalonePageLinks(
      new URL('https://example.com/en/home'),
      'home',
      customIndex,
      locales,
    )

    expect(result[2]).toEqual(
      expect.objectContaining({
        locale: 'fr',
      }),
    )
  })

  it('accepts urls with a trailing slash', () => {
    const result = createStandalonePageLinks(
      new URL('https://example.com/en/home/'),
      'home',
      index,
      locales,
    )

    expect(result).toHaveLength(3)
  })
})