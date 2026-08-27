import { describe, expect, it } from 'vitest'
import { createTranslationIndex, LocalizedEntry } from '@secorto/i18n'

type TestLocales = 'es' | 'en' | 'fr'
type TestContent = { text: string }

/**
 * Factory function to create a LocalizedEntry with default values.
 * @template K - The translation key for the entry.
 * @param translationKey - The translation key for the entry.
 * @param locale - The locale for the entry.
 * @returns A LocalizedEntry with default values for testing.
 */
function createEntry<K extends string>(
  translationKey: K,
  locale: TestLocales,
): LocalizedEntry<TestContent, 'guides', TestLocales> {
  return {
    cleanId: 'default-id',
    section: 'guides',
    entry: { text: 'default content' },
    translationKey,
    locale,
  }
}

describe('createTranslationIndex', () => {
  it('groups entries by translation key and locale', () => {
    const esEntry = createEntry('playwright-guide', 'es')
    const enEntry = createEntry('playwright-guide', 'en')

    const index = createTranslationIndex([esEntry, enEntry])

    expect(index['playwright-guide'].es).toBe(esEntry)
    expect(index['playwright-guide'].en).toBe(enEntry)
  })

  it('throws on duplicate translation key and locale', () => {
    const entry1 = createEntry('playwright-guide', 'es')
    const entry2 = createEntry('playwright-guide', 'es')

    expect(() => 
      createTranslationIndex([entry1, entry2])
    ).toThrow('Duplicate translation for key "playwright-guide" and locale "es"')
  })

  it('supports content available in only one locale', () => {
    const esEntry = createEntry('playwright-guide', 'es')

    const index = createTranslationIndex([esEntry])

    expect(index['playwright-guide'].es).toBe(esEntry)
    expect(index['playwright-guide'].en).toBeUndefined()
  })

  it('should enforce safe navigation for missing translation keys', () => {
    const entry = createEntry('existing-key', 'es')
    const index = createTranslationIndex([entry])

    const missingGroup = index['missing-key']

    expect(missingGroup).toBeUndefined()
  })
})
