import { describe, it, expect } from 'vitest'
import { createSectionRoutes, getSectionsWithTagContent } from '@secorto/i18n'

const sectionRoutes = createSectionRoutes({
  blog: {es: 'blog', en: 'blog'},
  talk: {es: 'talk', en: 'charla'}
})

type Item = {
  tags: string[]
}

const itemsBySection = {
  blog: [
    { tags: ['javascript', 'typescript'] },
    { tags: ['javascript'] },
    { tags: ['astro'] },
  ],
  talk: [
    { tags: ['javascript'] },
    { tags: ['react'] },
  ],
}

const hasTag = (item: Item, tag: string) =>
  item.tags.includes(tag)

describe('getSectionsWithTagContent', () => {
  it('returns sections containing the specified tag with their counts', () => {
    expect(
      getSectionsWithTagContent(
        sectionRoutes,
        itemsBySection,
        'javascript',
        hasTag,
      ),
    ).toEqual([
      {
        section: 'blog',
        count: 2,
      },
      {
        section: 'talk',
        count: 1,
      },
    ])
  })

  it('returns only sections that contain the tag', () => {
    expect(
      getSectionsWithTagContent(
        sectionRoutes,
        itemsBySection,
        'astro',
        hasTag,
      ),
    ).toEqual([
      {
        section: 'blog',
        count: 1,
      },
    ])
  })

  it('returns an empty array when no section contains the tag', () => {
    expect(
      getSectionsWithTagContent(
        sectionRoutes,
        itemsBySection,
        'vue',
        hasTag,
      ),
    ).toEqual([])
  })

  it('uses the provided predicate to determine matches', () => {
    const customHasTag = (
      item: Item,
      tag: string,
    ) => item.tags.some(t => t.startsWith(tag))

    expect(
      getSectionsWithTagContent(
        sectionRoutes,
        itemsBySection,
        'java',
        customHasTag,
      ),
    ).toEqual([
      {
        section: 'blog',
        count: 2,
      },
      {
        section: 'talk',
        count: 1,
      },
    ])
  })
})
