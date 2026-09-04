import { describe, it, expect } from 'vitest'
import {
  createLocales,
  createSectionRoutes,
  createTagRoutes,
  getStaticPathsSectionTags,
} from '@secorto/i18n'

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
    tools: {
      es: 'herramientas',
      en: 'tools',
    },
  },
)

describe('getStaticPathsSectionTags', () => {
  it('generates all combinations of sections, locales and tags', () => {
    const paths = getStaticPathsSectionTags(
      locales,
      sectionRoutes,
      tagRoutes,
    )

    expect(paths).toHaveLength(8)
  })

  it('builds localized params and props', () => {
    const paths = getStaticPathsSectionTags(
      locales,
      sectionRoutes,
      tagRoutes,
    )

    expect(paths).toContainEqual({
      params: {
        locale: 'es',
        section: 'charla',
        tagIndex: 'etiquetas',
        tag: 'herramientas',
      },
      props: {
        section: 'talk',
        tag: 'tools',
      },
    })

    expect(paths).toContainEqual({
      params: {
        locale: 'en',
        section: 'blog',
        tagIndex: 'tags',
        tag: 'javascript',
      },
      props: {
        section: 'blog',
        tag: 'javascript',
      },
    })
  })

  it('returns paths for every tag in every section', () => {
    const paths = getStaticPathsSectionTags(
      locales,
      sectionRoutes,
      tagRoutes,
    )

    expect(
      paths.filter(
        path => path.props.section === 'blog',
      ),
    ).toHaveLength(4)

    expect(
      paths.filter(
        path => path.props.section === 'talk',
      ),
    ).toHaveLength(4)
  })
})
