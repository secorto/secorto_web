import { describe, it, expect } from 'vitest'
import { isAccessible, isAvailable, isMissing } from '@domain/translationLink'
import { buildHomeLinks, buildMissingLanguageLinks } from '@i18n/languagePickerUtils'
import { languageKeys } from '@i18n/ui'

describe('languagePickerUtils', () => {
  describe('buildHomeLinks', () => {
    it('returns links for all languages pointing to site root', () => {
      const links = buildHomeLinks()

      expect(links).toHaveLength(languageKeys.length)
      expect(links.every(l => isAccessible(l))).toBe(true)
      expect(links.every(l => isAvailable(l))).toBe(true)
    })

    it('includes proper prefixes for each language', () => {
      const links = buildHomeLinks()
      const en = links.find(l => l.locale === 'en')
      const es = links.find(l => l.locale === 'es')

      expect(en?.href).toMatch(/^\/en/)
      expect(es?.href).toBeDefined()
    })
  })

  describe('buildMissingLanguageLinks', () => {
    it('returns all locales as unavailable', () => {
      const links = buildMissingLanguageLinks()
      expect(links).toHaveLength(languageKeys.length)
      expect(links.every(l => !isAccessible(l) && isMissing(l))).toBe(true)
    })
  })
})
