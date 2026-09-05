import { describe, it, expect } from 'vitest'
import { createTagRoutes } from '@secorto/i18n'

const sectionRoutes = {
  getSectionURL: (
    section: 'blog' | 'talk',
    locale: 'es' | 'en',
  ) => {
    const routes = {
      blog: {
        es: '/es/blog',
        en: '/en/blog',
      },
      talk: {
        es: '/es/charla',
        en: '/en/talk',
      },
    }

    return routes[section][locale]
  },
}

const routes = createTagRoutes(
  sectionRoutes,
  {
    es: 'etiquetas',
    en: 'tags',
  },
  {
    javascript: {
      es: 'javascript',
      en: 'javascript',
    },
    tools: {
      es: 'herramientas',
      en: 'tools',
    },
  },
)

describe('getTags', () => {
  it('returns all configured tags', () => {
    expect(routes.getTags()).toEqual([
      'javascript',
      'tools',
    ])
  })
})

describe('getTagRoute', () => {
  it('returns the localized tag slug', () => {
    expect(
      routes.getTagRoute('tools', 'es'),
    ).toBe('herramientas')

    expect(
      routes.getTagRoute('tools', 'en'),
    ).toBe('tools')
  })
})

describe('getTagIndexRoute', () => {
  it('returns the localized tag index route', () => {
    expect(
      routes.getTagIndexRoute('es'),
    ).toBe('etiquetas')

    expect(
      routes.getTagIndexRoute('en'),
    ).toBe('tags')
  })
})

describe('getSectionTagURL', () => {
  it('builds localized section tag urls', () => {
    expect(
      routes.getSectionTagURL(
        'blog',
        'es',
        'tools',
      ),
    ).toBe(
      '/es/blog/etiquetas/herramientas',
    )

    expect(
      routes.getSectionTagURL(
        'talk',
        'en',
        'tools',
      ),
    ).toBe(
      '/en/talk/tags/tools',
    )
  })
})

describe('tagRoutes', () => {
  it('throws an error when duplicate routes are found', () => {
    expect(() =>
      createTagRoutes(
        sectionRoutes,
        {
          es: 'etiquetas',
          en: 'tags',
        },
        {
          javascript: {
            es: 'herramientas',
            en: 'javascript',
          },
          tools: {
            es: 'herramientas',
            en: 'tools',
          },
        },
      ),
    ).toThrow(
      'Route collision detected in TagRoutes: The slug "herramientas" for locale "es" is duplicated between "javascript" and "tools".',
    )
  })
})

describe('immutability', () => {
  it('freezes route definitions', () => {
    expect(
      Object.isFrozen(routes.routes),
    ).toBe(true)

    expect(
      Object.isFrozen(routes.routes.javascript),
    ).toBe(true)

    expect(
      Object.isFrozen(routes.routes.tools),
    ).toBe(true)
  })
})
