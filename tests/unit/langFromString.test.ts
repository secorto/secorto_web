import { describe, it, expect } from 'vitest'
import { langFromString } from '@i18n/utils'
import { ui } from '@i18n/ui'

describe('langFromString', () => {
  it('returns valid UILanguages for known keys from ui', () => {
    const keys = Object.keys(ui)
    for (const k of keys) {
      expect(langFromString(k)).toBe(k)
    }
  })

  it('throws TypeError for unknown or undefined languages', () => {
    expect(() => langFromString('xx')).toThrow(TypeError)
    expect(() => langFromString(undefined)).toThrow(TypeError)
    expect(() => langFromString('toString')).toThrow(TypeError)
    expect(() => langFromString('constructor')).toThrow(TypeError)
  })
})
