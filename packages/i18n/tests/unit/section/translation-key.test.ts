import { describe, it, expect } from 'vitest'
import { resolveTranslationKey } from '@secorto/i18n'

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
