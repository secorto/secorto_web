import {
  describe,
  expect,
  expectTypeOf,
  it,
} from 'vitest'
import {
  createTranslationIndex,
  LocalizedEntry,
  TranslationGroup,
} from '@secorto/i18n'

type TestLocales = 'es' | 'en' | 'fr'

type TestContent = {
  text: string
}

type Section = 'blog'

/**
 * Factory function to create a LocalizedEntry with default values.
 */
function createEntry<K extends string>(
  translationKey: K,
  locale: TestLocales,
): LocalizedEntry<Section, TestContent, TestLocales> {
  return {
    section: 'blog',
    cleanId: 'default-id',
    original: {
      text: 'default content',
    },
    draft: false,
    translationKey,
    locale,
  }
}

describe('createTranslationIndex', () => {
  it('groups entries by translation key and locale', () => {
    const esEntry = createEntry(
      'playwright-guide',
      'es',
    )

    const enEntry = createEntry(
      'playwright-guide',
      'en',
    )

    const index = createTranslationIndex([
      esEntry,
      enEntry,
    ])

    expect(
      index['playwright-guide']?.es,
    ).toBe(esEntry)

    expect(
      index['playwright-guide']?.en,
    ).toBe(enEntry)
  })

  it('throws on duplicate translation key and locale', () => {
    const entry1 = createEntry(
      'playwright-guide',
      'es',
    )

    const entry2 = createEntry(
      'playwright-guide',
      'es',
    )

    expect(() =>
      createTranslationIndex([
        entry1,
        entry2,
      ]),
    ).toThrow(
      'Duplicate translation for key "playwright-guide" and locale "es"',
    )
  })

  it('supports content available in only one locale', () => {
    const esEntry = createEntry(
      'playwright-guide',
      'es',
    )

    const index = createTranslationIndex([
      esEntry,
    ])

    expect(
      index['playwright-guide']?.es,
    ).toBe(esEntry)

    expect(
      index['playwright-guide']?.en,
    ).toBeUndefined()
  })

  it('keeps the invariant that an existing group contains entries', () => {
    const entry = createEntry(
      'existing-key',
      'es',
    )

    const index = createTranslationIndex([
      entry,
    ])

    const group = index['existing-key']
    const missingGroup = index['missing-key']

    expect(group).toBeDefined()
    expect(Object.keys(group ?? {})).toHaveLength(1)
    expect(group?.es).toBe(entry)
    expect(group?.fr).toBeUndefined()
    expect(missingGroup).toBeUndefined()

    expectTypeOf(group?.fr)
      .toEqualTypeOf<LocalizedEntry<Section, TestContent, TestLocales> | undefined>()

    expectTypeOf(missingGroup)
      .toEqualTypeOf<
        Partial<Record<string, TranslationGroup<Section, TestLocales, TestContent>>>[string]
      >()
  })
})
