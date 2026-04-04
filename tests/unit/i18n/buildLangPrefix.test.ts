import { describe, it, expect, vi } from 'vitest'
import {buildLangPrefix } from '@i18n/languagePickerUtils'

vi.mock('@i18n/config', () => ({
  showDefaultLang: false
}))

describe('buildLangPrefix', () => {
  it('retorna string vacío para idioma por defecto cuando showDefaultLang es false', () => {
    const result = buildLangPrefix('es')
    expect(result).toBe('')
  })

  it('retorna /locale para idioma no por defecto', () => {
    const result = buildLangPrefix('en')
    expect(result).toBe('/en')
    expect(result).toMatch(/^\//)
  })
})
