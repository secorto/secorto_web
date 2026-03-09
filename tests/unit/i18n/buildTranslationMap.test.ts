import { describe, it, expect, vi, beforeEach } from 'vitest'
import { buildTranslationMap, resolveSeriesCanonicalLocale } from '@i18n/buildTranslationMap'

vi.mock('astro:content', () => ({
  getCollection: vi.fn()
}))

import { getCollection } from 'astro:content'

beforeEach(() => {
  (getCollection as ReturnType<typeof vi.fn>).mockReset()
})

describe('buildTranslationMap', () => {
  it('groups same-cleanId entries under that cleanId', async () => {
    (getCollection as ReturnType<typeof vi.fn>).mockResolvedValue([
      { id: 'es/2025-01-01-my-post', data: { title: 'ES', translation_status: 'original' } },
      { id: 'en/2025-01-01-my-post', data: { title: 'EN', translation_status: 'translated' } }
    ])

    const map = await buildTranslationMap('blog')

    expect(map['2025-01-01-my-post']).toBeDefined()
    expect(map['2025-01-01-my-post'].es.title).toBe('ES')
    expect(map['2025-01-01-my-post'].en.title).toBe('EN')
  })

  it('indexes by every locale slug so lookup works from any locale URL', async () => {
    (getCollection as ReturnType<typeof vi.fn>).mockResolvedValue([
      { id: 'es/2025-01-01-calendario', data: { title: 'ES', postId: 'shared-id' } },
      { id: 'en/2025-01-01-calendar', data: { title: 'EN', postId: 'shared-id' } }
    ])

    const map = await buildTranslationMap('blog')

    // Lookup from ES URL slug
    expect(map['2025-01-01-calendario']).toBeDefined()
    expect(map['2025-01-01-calendario'].en.slug).toBe('2025-01-01-calendar')
    // Lookup from EN URL slug
    expect(map['2025-01-01-calendar']).toBeDefined()
    expect(map['2025-01-01-calendar'].es.slug).toBe('2025-01-01-calendario')
    // Same object reference (same series)
    expect(map['2025-01-01-calendario']).toBe(map['2025-01-01-calendar'])
  })

  it('slug field on each entry holds the file-based cleanId (URL slug)', async () => {
    (getCollection as ReturnType<typeof vi.fn>).mockResolvedValue([
      { id: 'es/2025-01-01-my-post', data: { title: 'ES' } }
    ])

    const map = await buildTranslationMap('blog')
    expect(map['2025-01-01-my-post'].es.slug).toBe('2025-01-01-my-post')
  })

  it('preserves translation_status metadata', async () => {
    (getCollection as ReturnType<typeof vi.fn>).mockResolvedValue([
      { id: 'en/my-post', data: { title: 'Title', translation_status: 'translated' } }
    ])

    const map = await buildTranslationMap('blog')
    expect(map['my-post'].en.translation_status).toBe('translated')
  })
})

describe('resolveSeriesCanonicalLocale', () => {
  it('prefers es when available', () => {
    expect(resolveSeriesCanonicalLocale(['en', 'es'])).toBe('es')
  })

  it('falls back to first locale when es not present', () => {
    expect(resolveSeriesCanonicalLocale(['en', 'fr'])).toBe('en')
  })

  it('uses custom defaultLocale when provided', () => {
    expect(resolveSeriesCanonicalLocale(['en', 'fr'], 'fr')).toBe('fr')
  })

  it('returns first element when nothing matches', () => {
    expect(resolveSeriesCanonicalLocale(['en'])).toBe('en')
  })
})
