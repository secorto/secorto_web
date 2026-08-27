import { describe, it, expect } from 'vitest'
import {
  adaptToLocalizedEntry,
  createLocales,
  resolveTranslationKey,
} from '@secorto/i18n'

describe('resolveTranslationKey', () => {
  it('returns translationKey when it exists and is a string', () => {
    const data = { translationKey: 'title.home' }
    const result = resolveTranslationKey(data, 'home')
    expect(result).toBe('title.home')
  })

  it('returns cleanId when translationKey does not exist', () => {
    const data = { other: 123 }
    const result = resolveTranslationKey(data, 'home')
    expect(result).toBe('home')
  })

  it('returns cleanId when translationKey exists but is not a string', () => {
    const data = { translationKey: 42 }
    const result = resolveTranslationKey(data, 'home')
    expect(result).toBe('home')
  })

  it('handles objects with additional properties', () => {
    const data = { translationKey: 'section.about', foo: 'bar', count: 10 }
    const result = resolveTranslationKey(data, 'about')
    expect(result).toBe('section.about')
  })

  it('works with generic object types', () => {
    interface Entry {
      translationKey?: string
      extra?: number
    }

    const data: Entry = { extra: 99 }
    const result = resolveTranslationKey(data, 'fallback')
    expect(result).toBe('fallback')
  })
})

describe('adaptToLocalizedEntry', () => {
  const locales = createLocales(['en', 'es'] as const)

  it('marks a draft as false when the draft field is present but not true', () => {
    const result = adaptToLocalizedEntry({
      id: 'es/intro',
      collection: 'blog',
      data: { title: 'Intro', draft: false },
    }, locales)

    expect(result).toMatchObject({
      cleanId: 'intro',
      locale: 'es',
      draft: false,
    })
  })

  it('marks a draft as false when the draft field is absent', () => {
    const result = adaptToLocalizedEntry({
      id: 'en/landing',
      collection: 'blog',
      data: { title: 'Landing' },
    }, locales)

    expect(result).toMatchObject({
      cleanId: 'landing',
      locale: 'en',
      draft: false,
    })
  })
})
