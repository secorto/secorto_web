import { describe, expect, it } from 'vitest'

import { availableAtLocale } from '@secorto/i18n'

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
