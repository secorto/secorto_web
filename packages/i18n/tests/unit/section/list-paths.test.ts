import { describe, expect, it } from 'vitest'

import {
  createLocales,
  createSectionRoutes,
  getStaticPathsSections,
} from '@secorto/i18n'

describe('getStaticPathsSections', () => {
  it('generates one path per section and locale', async () => {
    const routes = createSectionRoutes({
      blog: {
        es: 'blog',
        en: 'blog',
      },
      talk: {
        es: 'charla',
        en: 'talk',
      },
    })

    const locales = createLocales(['es', 'en'] as const)

    await expect(getStaticPathsSections(routes, locales)).resolves.toEqual([
      {
        params: {
          locale: 'es',
          section: 'blog',
        },
        props: {
          section: 'blog',
        },
      },
      {
        params: {
          locale: 'en',
          section: 'blog',
        },
        props: {
          section: 'blog',
        },
      },
      {
        params: {
          locale: 'es',
          section: 'charla',
        },
        props: {
          section: 'talk',
        },
      },
      {
        params: {
          locale: 'en',
          section: 'talk',
        },
        props: {
          section: 'talk',
        },
      },
    ])
  })

  it('keeps section order and locale order stable', async () => {
    const routes = createSectionRoutes({
      docs: {
        es: 'documentacion',
        en: 'docs',
      },
      blog: {
        es: 'blog',
        en: 'blog',
      },
    })

    const locales = createLocales(['es', 'en'] as const)
    const result = await getStaticPathsSections(routes, locales)

    expect(result.map(path => ({
      id: path.props.section,
      locale: path.params.locale,
      section: path.params.section,
    }))).toEqual([
      { id: 'docs', locale: 'es', section: 'documentacion' },
      { id: 'docs', locale: 'en', section: 'docs' },
      { id: 'blog', locale: 'es', section: 'blog' },
      { id: 'blog', locale: 'en', section: 'blog' },
    ])
  })
})
