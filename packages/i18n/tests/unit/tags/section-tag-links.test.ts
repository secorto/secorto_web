import { describe, expect, it } from 'vitest'

import {
  availableLink,
  createSectionRoutes,
  createSectionTagTranslationLinks,
  createTagRoutes,
  missingLink,
} from '@secorto/i18n'

const sectionRoutes = createSectionRoutes({
  blog: {
    es: 'blog',
    en: 'blog',
  },
})

const tagRoutes = createTagRoutes(
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
    dev: {
      es: 'desarrollo',
      en: 'dev',
    },
  },
)

describe('createSectionTagTranslationLinks', () => {
  it('creates available and missing links preserving locale order', () => {
    const links =
      createSectionTagTranslationLinks(
        ['es', 'en'],
        ['en'],
        'blog',
        'javascript',
        tagRoutes,
      )

    expect(links).toEqual([
      missingLink('es'),
      availableLink(
        '/en/blog/tags/javascript',
        'en',
      ),
    ])
  })

  it('creates available links for every sibling locale', () => {
    const links =
      createSectionTagTranslationLinks(
        ['en', 'es'],
        ['en', 'es'],
        'blog',
        'javascript',
        tagRoutes,
      )

    expect(links).toEqual([
      availableLink(
        '/en/blog/tags/javascript',
        'en',
      ),
      availableLink(
        '/es/blog/etiquetas/javascript',
        'es',
      ),
    ])
  })

  it('marks all locales as missing when no siblings exist', () => {
    const links =
      createSectionTagTranslationLinks(
        ['en', 'es'],
        [],
        'blog',
        'javascript',
        tagRoutes,
      )

    expect(links).toEqual([
      missingLink('en'),
      missingLink('es'),
    ])
  })
  it('uses localized URLs from tag routes', () => {
    const links =
      createSectionTagTranslationLinks(
        ['en', 'es'],
        ['en', 'es'],
        'blog',
        'dev',
        tagRoutes,
      )

    expect(links).toEqual([
      availableLink(
        '/en/blog/tags/dev',
        'en',
      ),
      availableLink(
        '/es/blog/etiquetas/desarrollo',
        'es',
      ),
    ])
  })
})
