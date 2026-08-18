import { afterEach, describe, expect, it, vi } from 'vitest'

const OLD_ENV = { ...process.env }

afterEach(() => {
  process.env = { ...OLD_ENV }
  vi.resetModules()
})

describe('a11yTestContents', () => {
  it('filters to the default language by default', async () => {
    const { defaultLang } = await import('@i18n/ui')
    const { a11yTestContents } = await import('@tests/support/data/testContents')

    expect(a11yTestContents.length).toBeGreaterThan(0)
    expect(a11yTestContents.every((content) => content.locale === defaultLang)).toBe(true)
  })

  it('returns the full content list when A11Y_ALL_LANGUAGES is enabled', async () => {
    process.env.A11Y_ALL_LANGUAGES = 'true'

    const { testContents } = await import('@tests/support/data/testContents')
    const { a11yTestContents } = await import('@tests/support/data/testContents')

    expect(a11yTestContents).toEqual(testContents)
  })
})
