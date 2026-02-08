import { describe, it, expect, vi } from 'vitest'

vi.mock('astro:content', () => ({
  getCollection: vi.fn(async () => entries)
}))

const entries = [
  {
    id: 'en/my-post',
    data: {
      title: 'Title',
      canonical: 'my-post',
      date: new Date('2020-01-01'),
      translation_status: 'translated',
      translation_origin: { locale: 'es', id: '2020-01-01-my-post' }
    }
  }
]

import { buildTranslationMap } from '../../../src/i18n/buildTranslationMap'

describe('buildTranslationMap', () => {
  it('builds map with translation_status and origin when present', async () => {
    const map = await buildTranslationMap('blog')
    expect(map['my-post']).toBeDefined()
    expect(map['my-post'].en.title).toBe('Title')
    expect(map['my-post'].en.translation_status).toBe('translated')
    expect(map['my-post'].en.translation_origin).toEqual({ locale: 'es', id: '2020-01-01-my-post' })
  })
})
