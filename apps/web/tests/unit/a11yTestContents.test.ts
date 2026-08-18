import { afterEach, describe, expect, it, vi } from 'vitest'

const OLD_ENV = { ...process.env }

afterEach(() => {
  process.env = { ...OLD_ENV }
  vi.resetModules()
})

describe('a11yTestContents', () => {
  it('filters to the default language by default', async () => {
    vi.resetModules()
    delete process.env.A11Y_ALL_LANGUAGES

    const { defaultLang } = await import('@i18n/ui')
    const { enabledA11yLanguages } = await import('@tests/support/data/a11yLanguages')
    const { a11yTestContents } = await import('@tests/support/data/testContents')

    expect(enabledA11yLanguages).toEqual([defaultLang])
    expect(a11yTestContents.length).toBeGreaterThan(0)
    expect(a11yTestContents.every((content) => content.locale === defaultLang)).toBe(true)
  })

  it('returns the full content list when A11Y_ALL_LANGUAGES is enabled', async () => {
    vi.resetModules()
    process.env.A11Y_ALL_LANGUAGES = 'true'

    const { languageKeys } = await import('@i18n/ui')
    const { enabledA11yLanguages } = await import('@tests/support/data/a11yLanguages')
    const { testContents, a11yTestContents } = await import('@tests/support/data/testContents')

    expect(enabledA11yLanguages).toEqual(languageKeys)
    expect(a11yTestContents).toEqual(testContents)
  })
})
