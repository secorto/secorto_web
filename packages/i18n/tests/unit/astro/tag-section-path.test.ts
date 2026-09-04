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

import type { GenericCollectionEntry } from '@secorto/i18n'

type Entry = GenericCollectionEntry<
  'blog' | 'talk',
  {
    draft: boolean
    tags: string[]
  }
>
describe('getStaticPathsSectionTags', () => {
  it('builds localized params and props', async () => {

    const paths = await getStaticPathsSectionTags(
      locales,
      sectionRoutes,
      tagRoutes,
      async (
        section: 'blog' | 'talk',
        _locale: 'es' | 'en',
      ): Promise<Entry[]> => {
        if (section === 'blog') {
          return [
            {
              id: 'post-1',
              collection: 'blog',
              data: {
                draft: false,
                tags: ['javascript'],
              },
            },
          ]
        }

        return [
          {
            id: 'talk-1',
            collection: 'talk',
            data: {
              draft: false,
              tags: ['tools'],
            },
          },
        ]
      },
    )

    expect(paths).toContainEqual({
      params: {
        locale: 'es',
        section: 'blog',
        tagIndex: 'etiquetas',
        tag: 'javascript',
      },
      props: {
        section: 'blog',
        tag: 'javascript',
      },
    })

    expect(paths).toContainEqual({
      params: {
        locale: 'en',
        section: 'talk',
        tagIndex: 'tags',
        tag: 'tools',
      },
      props: {
        section: 'talk',
        tag: 'tools',
      },
    })
  })

  it('generates paths only for tags that exist in a section', async () => {
    const paths = await getStaticPathsSectionTags(
      locales,
      sectionRoutes,
      tagRoutes,
      async section => {
        if (section === 'blog') {
          return [
            {
              id: 'post-1',
              collection: 'blog',
              data: {
                draft: false,
                tags: ['javascript'],
              },
            },
          ]
        }

        return []
      },
    )

    expect(paths).toHaveLength(2)

    expect(
      paths.every(
        path =>
          path.props.section === 'blog' &&
          path.props.tag === 'javascript',
      ),
    ).toBe(true)
  })

  it('does not generate paths for empty tag pages', async () => {
    const paths = await getStaticPathsSectionTags(
      locales,
      sectionRoutes,
      tagRoutes,
      async () => [],
    )

    expect(paths).toEqual([])
  })

  it('generates paths for every locale where content exists', async () => {
    const paths = await getStaticPathsSectionTags(
      locales,
      sectionRoutes,
      tagRoutes,
      async section => [
        {
          id: `${section}-1`,
          collection: section,
          data: {
            draft: false,
            tags: ['javascript'],
          },
        },
      ],
    )

    expect(
      paths.filter(
        path =>
          path.props.tag === 'javascript' &&
          path.props.section === 'blog',
      ),
    ).toHaveLength(2)

    expect(
      paths.filter(
        path =>
          path.props.tag === 'javascript' &&
          path.props.section === 'talk',
      ),
    ).toHaveLength(2)
  })

  it('does not generate routes for configured tags without content', async () => {
    const paths = await getStaticPathsSectionTags(
      locales,
      sectionRoutes,
      tagRoutes,
      async section => [
        {
          id: `${section}-1`,
          collection: section,
          data: {
            draft: false,
            tags: ['javascript'],
          },
        },
      ],
    )

    expect(
      paths.some(
        path => path.props.tag === 'tools',
      ),
    ).toBe(false)
  })
})
