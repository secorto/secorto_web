import { describe, it, expect } from 'vitest'
import {
  buildInfoFromLocales,
  checkTranslatedMissingOrigin,
  checkOriginButNotTranslated,
  checkOriginPresentBothOriginal,
  findInconsistenciesFromMap
} from '../../scripts/lib/consistency-checks.js'

type LocaleOrigin = { locale: string; id: string }
type LocaleInfo = { status?: string; origin?: LocaleOrigin }
type InfoMap = Record<string, LocaleInfo>

describe('consistency checks (unit)', () => {
  it('builds info from locales map', () => {
    const locales = new Map<string, { path: string; fm: Record<string, unknown> }>()
    locales.set('en', { path: 'a', fm: { translation_status: 'original' } })
    locales.set('es', { path: 'b', fm: { translation_status: 'translated', translation_origin: { locale: 'en', id: 'a' } } })
    const info: InfoMap = buildInfoFromLocales(locales)
    expect(info.en.status).toBe('original')
    expect(info.es.status).toBe('translated')
    expect(info.es.origin).toEqual({ locale: 'en', id: 'a' })
  })

  it('detects translated_missing_origin', () => {
    const info = {
      en: { status: 'translated', origin: undefined }
    }
    const res = checkTranslatedMissingOrigin(info, 'blog', 'id')
    expect(res).toHaveLength(1)
    expect(res[0].type).toBe('translated_missing_origin')
  })

  it('detects origin_but_not_translated', () => {
    const info = {
      en: { status: 'original' },
      es: { status: 'original', origin: { locale: 'en', id: 'id' } }
    }
    const res = checkOriginButNotTranslated(info, 'blog', 'id')
    expect(res).toHaveLength(1)
    expect(res[0].type).toBe('origin_but_not_translated')
  })

  it('detects origin_present_both_original', () => {
    const info = {
      en: { status: 'original' },
      es: { status: 'original', origin: { locale: 'en', id: 'id' } }
    }
    const res = checkOriginPresentBothOriginal(info, 'blog', 'id')
    expect(res).toHaveLength(1)
    expect(res[0].type).toBe('origin_present_both_original')
  })

  it('integrates via findInconsistenciesFromMap', () => {
    const map = new Map()
    const coll = new Map()
    const locales = new Map()
    locales.set('en', { path: 'p', fm: { translation_status: 'original' } })
    locales.set('es', { path: 'q', fm: { translation_status: 'original', translation_origin: { locale: 'en', id: 'p' } } })
    coll.set('post.md', locales)
    map.set('blog', coll)

    const inconsistencies = findInconsistenciesFromMap(map)
    const types = inconsistencies.map(i => i.type).sort()
    expect(types).toContain('origin_but_not_translated')
    expect(types).toContain('origin_present_both_original')
  })
})
