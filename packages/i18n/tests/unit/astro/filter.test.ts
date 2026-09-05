import { describe, expect, it } from 'vitest'

import { availableAtLocale, withTag } from '@secorto/i18n'

describe('availableAtLocale', () => {
  const filter = availableAtLocale("es")

  it('returns true when entry belongs to locale and is not draft', () => {
    const entry = {
      collection: 'blog',
      id: "es/my-post",
      data: {
        draft: false,
      },
    }

    expect(filter(entry)).toBe(true)
  })

  it('returns false when entry belongs to another locale', () => {
    const entry = {
      collection: 'blog',
      id: "en/my-post",
      data: {
        draft: false,
      },
    }

    expect(filter(entry)).toBe(false)
  })

  it('returns false when entry is draft', () => {
    const entry = {
      collection: 'blog',
      id: "es/my-post",
      data: {
        draft: true,
      },
    }

    expect(filter(entry)).toBe(false)
  })

  it('returns true when entry draft is undefined', () => {
    const entry = {
      collection: 'blog',
      id: "es/my-post",
      data: {},
    }

    expect(filter(entry)).toBe(true)
  })
})

describe('withTag', () => {
  it('returns true when the entry contains the tag', () => {
    const hasJavascript = withTag('javascript')

    expect(
      hasJavascript({
        id: '1',
        collection: 'blog',
        data: {
          tags: ['javascript', 'typescript'],
        },
      }),
    ).toBe(true)
  })

  it('returns false when the entry does not contain the tag', () => {
    const hasJavascript = withTag('javascript')

    expect(
      hasJavascript({
        id: '1',
        collection: 'blog',
        data: {
          tags: ['typescript'],
        },
      }),
    ).toBe(false)
  })

  it('returns false when tags are undefined', () => {
    const hasJavascript = withTag('javascript')

    expect(
      hasJavascript({
        id: '1',
        collection: 'blog',
        data: {},
      }),
    ).toBe(false)
  })

  it('creates a predicate bound to the provided tag', () => {
    const hasAstro = withTag('astro')

    expect(
      hasAstro({
        id: '1',
        collection: 'blog',
        data: {
          tags: ['astro'],
        },
      }),
    ).toBe(true)

    expect(
      hasAstro({
        id: '2',
        collection: 'blog',
        data: {
          tags: ['javascript'],
        },
      }),
    ).toBe(false)
  })
})
