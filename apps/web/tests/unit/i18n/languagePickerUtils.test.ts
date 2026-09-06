import { describe, it, expect } from 'vitest'
import { isAccessible, isAvailable, isMissing } from '@domain/translationLink'
import { buildMissingLanguageLinks } from '@i18n/languagePickerUtils'
import { languageKeys } from '@i18n/ui'

describe('languagePickerUtils', () => {
  describe('buildMissingLanguageLinks', () => {
    it('returns all locales as unavailable', () => {
      const links = buildMissingLanguageLinks()
      expect(links).toHaveLength(languageKeys.length)
      expect(links.every(l => !isAccessible(l) && isMissing(l))).toBe(true)
    })
  })
})
