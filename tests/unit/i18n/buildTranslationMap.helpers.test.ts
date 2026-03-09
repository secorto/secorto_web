import { describe, it, expect } from 'vitest'
import { parseCollectionEntries, groupBySeries, buildIndexes } from '@i18n/buildTranslationMap'

describe('buildTranslationMap helpers', () => {
  it('parseCollectionEntries extracts fields and honors postId', () => {
    const raw = [
      {
        id: 'es/2025-01-01-mi-post',
        data: { title: 'Mi post', postId: 'serie-1', date: new Date('2025-01-01'), translation_status: 'original' },
      },
    ]

    const parsed = parseCollectionEntries(raw as any)
    expect(parsed).toHaveLength(1)
    expect(parsed[0].seriesKey).toBe('serie-1')
    expect(parsed[0].cleanId).toBe('2025-01-01-mi-post')
    expect(parsed[0].locale).toBe('es')
    expect(parsed[0].translation_status).toBe('original')
  })

  it('groupBySeries groups entries under the same seriesKey', () => {
    const parsed = [
      { seriesKey: 'shared', locale: 'es', cleanId: 'calendario', id: 'es/calendario', title: 'ES', date: undefined, translation_status: undefined },
      { seriesKey: 'shared', locale: 'en', cleanId: 'calendar', id: 'en/calendar', title: 'EN', date: undefined, translation_status: undefined },
    ]

    const grouped = groupBySeries(parsed as any)
    expect(grouped['shared']).toBeDefined()
    expect(grouped['shared'].es.slug).toBe('calendario')
    expect(grouped['shared'].en.slug).toBe('calendar')
  })

  it('buildIndexes produces seriesByKey and slugIndex mapping', () => {
    const seriesMap = {
      shared: {
        es: { id: 'es/calendario', slug: 'calendario', title: 'ES' },
        en: { id: 'en/calendar', slug: 'calendar', title: 'EN' },
      },
    }

    const { seriesByKey, slugIndex } = buildIndexes(seriesMap as any)
    expect(seriesByKey.shared).toBeDefined()
    expect(slugIndex['calendario']).toBe('shared')
    expect(slugIndex['calendar']).toBe('shared')
  })
})
