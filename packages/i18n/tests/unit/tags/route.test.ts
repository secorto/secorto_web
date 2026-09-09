import { describe, it, expect } from 'vitest'
import { createLocales, createSectionRoutes, createTagRoutes } from '@secorto/i18n'

const locales = createLocales(['es', 'en'] as const)
const sectionRoutes = createSectionRoutes({
  blog: {
    es: 'blog',
    en: 'blog',
  },
  talk: {
    es: 'charla',
    en: 'talk',
  },
}, locales)

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
  locales,
)

describe('getTags', () => {
  it('returns all configured tags', () => {
    expect(routes.getTags()).toEqual([
      'javascript',
      'tools',
    ])
  })
})

describe('getTagSlug', () => {
  it('returns the localized tag slug', () => {
    expect(
      routes.getTagSlug('tools', 'es'),
    ).toBe('herramientas')

    expect(
      routes.getTagSlug('tools', 'en'),
    ).toBe('tools')
  })
})

describe('getTagIndexSlug', () => {
  it('returns the localized tag index segment', () => {
    expect(
      routes.getTagIndexSlug('es'),
    ).toBe('etiquetas')

    expect(
      routes.getTagIndexSlug('en'),
    ).toBe('tags')
  })
})

describe('getTagIndexPath', () => {
  it('returns the locale-prefixed tag index URL', () => {
    expect(
      routes.getTagIndexPath('es'),
    ).toBe('/es/etiquetas')

    expect(
      routes.getTagIndexPath('en'),
    ).toBe('/en/tags')
  })
})

describe('getSectionTagPath', () => {
  it('builds localized section tag urls', () => {
    expect(
      routes.getSectionTagPath(
        'blog',
        'es',
        'tools',
      ),
    ).toBe(
      '/es/blog/etiquetas/herramientas',
    )

    expect(
      routes.getSectionTagPath(
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
        locales,
      ),
    ).toThrow(
      'Slug collision detected in TagRoutes: The slug "herramientas" for locale "es" is duplicated between "javascript" and "tools".',
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
