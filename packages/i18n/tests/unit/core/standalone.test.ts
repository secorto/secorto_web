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
        'en/home',
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
        'fr/accueil',
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
        'en/wrong-route',
        'home',
        index,
        locales,
      ),
    ).toThrow(
      "Route 'en/wrong-route' does not belong to standalone page 'home'.",
    )
  })

  it('returns links for all available locales', () => {
    const result = createStandalonePageLinks(
      'en/home',
      'home',
      index,
      locales,
    )

    expect(result).toHaveLength(3)

    expect(result).toEqual([
      {
        type: 'available',
        href: '/en/home',
        locale: 'en',
      },
      {
        type: 'available',
        href: '/es/inicio',
        locale: 'es',
      },
      {
        type: 'available',
        href: '/fr/accueil',
        locale: 'fr',
      },
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
      'en/home',
      'home',
      customIndex,
      locales,
    )

    expect(result).toContainEqual({
      type: 'draft',
      href: '/es/inicio',
      locale: 'es',
    })
  })

  it('returns a missing link when a locale entry does not exist', () => {
    const customIndex = {
      home: {
        en: { route: 'home' },
        es: { route: 'inicio' },
      },
    }

    const result = createStandalonePageLinks(
      'en/home',
      'home',
      customIndex,
      locales,
    )

    expect(result[2]).toEqual({
      type: 'missing',
      href: null,
      locale: 'fr',
    })
  })
})