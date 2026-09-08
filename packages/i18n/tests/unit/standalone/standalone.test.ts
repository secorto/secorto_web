import { describe, expect, it } from 'vitest'

import {
  createLocales,
  createStandalonePageLinks,
  createStandalonePageRoutes,
} from '@secorto/i18n'

const locales = createLocales(['en', 'es', 'fr'])

describe('createStandalonePageLinks', () => {
  const routes = createStandalonePageRoutes(
    {
      home: {
        en: { slug: 'home' },
        es: { slug: 'inicio' },
        fr: { slug: 'accueil' },
      },
    },
    locales,
  )

  it('throws when translation key is not indexed', () => {
    expect(() => {
      createStandalonePageLinks(
        'en/home',
        'unknown',
        routes,
        locales,
      )
    }).toThrow(
      "Standalone page 'unknown' is not indexed.",
    )
  })

  it('throws when current locale has no entry', () => {
    const customRoutes = createStandalonePageRoutes(
      {
        home: {
          en: { slug: 'home' },
          es: { slug: 'inicio' },
        },
      },
      locales,
    )

    expect(() =>
      createStandalonePageLinks(
        'fr/accueil',
        'home',
        customRoutes,
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
        routes,
        locales,
      ),
    ).toThrow(
      "Path 'en/wrong-route' does not belong to standalone page 'home'.",
    )
  })

  it('returns links for all available locales', () => {
    const result = createStandalonePageLinks(
      'en/home',
      'home',
      routes,
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
    const customRoutes = createStandalonePageRoutes(
      {
        home: {
          en: { slug: 'home' },
          es: { slug: 'inicio', draft: true },
          fr: { slug: 'accueil' },
        },
      },
      locales,
    )

    const result = createStandalonePageLinks(
      'en/home',
      'home',
      customRoutes,
      locales,
    )

    expect(result).toContainEqual({
      type: 'draft',
      href: '/es/inicio',
      locale: 'es',
    })
  })

  it('returns a missing link when a locale entry does not exist', () => {
    const customRoutes = createStandalonePageRoutes(
      {
        home: {
          en: { slug: 'home' },
          es: { slug: 'inicio' },
        },
      },
      locales,
    )

    const result = createStandalonePageLinks(
      'en/home',
      'home',
      customRoutes,
      locales,
    )

    expect(result[2]).toEqual({
      type: 'missing',
      href: null,
      locale: 'fr',
    })
  })
})
