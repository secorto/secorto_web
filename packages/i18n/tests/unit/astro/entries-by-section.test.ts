import { describe, it, expect } from 'vitest'
import {
  createSectionRoutes,
  GenericCollectionEntry,
  getEntriesBySection,
} from '@secorto/i18n'

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

type Entry = GenericCollectionEntry<
  'blog' | 'talk',
  { draft: boolean }
>

describe('getEntriesBySection', () => {
  it('groups entries by section', async () => {
    const result = await getEntriesBySection(
      sectionRoutes,
      async (
        section: 'blog' | 'talk',
      ): Promise<Entry[]> => {
        if (section === 'blog') {
          return [
            {
              id: 'post-1',
              collection: 'blog',
              data: {
                draft: false,
              },
            },
            {
              id: 'post-2',
              collection: 'blog',
              data: {
                draft: false,
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
            },
          },
        ]
      },
    )

    expect(result).toEqual({
      blog: [
        {
          id: 'post-1',
          collection: 'blog',
          data: {
            draft: false,
          },
        },
        {
          id: 'post-2',
          collection: 'blog',
          data: {
            draft: false,
          },
        },
      ],
      talk: [
        {
          id: 'talk-1',
          collection: 'talk',
          data: {
            draft: false,
          },
        },
      ],
    })
  })

  it('returns empty sections when no entries exist', async () => {
    const result = await getEntriesBySection(
      sectionRoutes,
      async section =>
        section === 'blog'
          ? [
            {
              id: 'post-1',
              collection: 'blog',
              data: {
                draft: false,
              },
            },
          ]
          : [],
    )

    expect(result).toEqual({
      blog: [
        {
          id: 'post-1',
          collection: 'blog',
          data: {
            draft: false,
          },
        },
      ],
      talk: [],
    })
  })
})
