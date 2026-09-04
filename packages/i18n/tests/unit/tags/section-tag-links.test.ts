import { describe, expect, it } from 'vitest'

import {
  availableLink,
  missingLink,
  createSectionTagTranslationLinks
} from '@secorto/i18n'

describe('createSectionTagTranslationLinks', () => {
  const tagRoutes = {
    getSectionTagURL: (
      section: string,
      locale: string,
      tag: string,
    ) => `/${locale}/${section}/tags/${tag}`,
  }

  it('creates available links for sibling locales', () => {
    const links = createSectionTagTranslationLinks(
      ['en', 'es'],
      ['en', 'es'],
      'blog',
      'javascript',
      tagRoutes as never,
    )

    expect(links).toEqual([
      availableLink(
        '/en/blog/tags/javascript',
        'en',
      ),
      availableLink(
        '/es/blog/tags/javascript',
        'es',
      ),
    ])
  })

  it('creates missing links for unavailable locales', () => {
    const links = createSectionTagTranslationLinks(
      ['en', 'es'],
      ['es'],
      'blog',
      'javascript',
      tagRoutes as never,
    )

    expect(links).toEqual([
      missingLink('en'),
      availableLink(
        '/es/blog/tags/javascript',
        'es',
      ),
    ])
  })

  it('marks all locales as missing when no siblings exist', () => {
    const links = createSectionTagTranslationLinks(
      ['en', 'es'],
      [],
      'blog',
      'javascript',
      tagRoutes as never,
    )

    expect(links).toEqual([
      missingLink('en'),
      missingLink('es'),
    ])
  })

  it('returns one link per supported locale', () => {
    const links = createSectionTagTranslationLinks(
      ['en', 'es', 'fr'],
      ['en'],
      'blog',
      'javascript',
      tagRoutes as never,
    )

    expect(links).toHaveLength(3)
  })

  it('uses localized URLs from tag routes', () => {
    const localizedTagRoutes = {
      getSectionTagURL: () =>
        '/es/blog/etiquetas/desarrollo',
    }

    const links = createSectionTagTranslationLinks(
      ['es'],
      ['es'],
      'blog',
      'dev',
      localizedTagRoutes as never,
    )

    expect(links).toEqual([
      availableLink(
        '/es/blog/etiquetas/desarrollo',
        'es',
      ),
    ])
  })
  it('preserves locale ordering', () => {
    const links = createSectionTagTranslationLinks(
      ['es', 'en'],
      ['en'],
      'blog',
      'javascript',
      tagRoutes as never,
    )

    expect(links).toEqual([
      missingLink('es'),
      availableLink(
        '/en/blog/tags/javascript',
        'en',
      ),
    ])
  })
})
