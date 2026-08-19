import { describe, it, expect, vi } from 'vitest'

// mock the path alias used by the utils module so Node resolution during tests works
vi.mock('@i18n/dateFormat', () => ({
  full: { dateStyle: 'full', timeZone: 'UTC' },
  monthYear: { month: 'long', year: 'numeric', timeZone: 'UTC' },
}))

// Mutable UI mock so tests can toggle `showDefaultLang` without hoisting issues
const { defaultLang, ui } = await import('@i18n/ui')


describe('i18n utils', () => {
  it('getLangFromUrl returns language when present and valid', async () => {
    const { getLangFromUrl } = await import('@i18n/utils')
    expect(getLangFromUrl(new URL('https://example.test/en/page'))).toBe('en')
  })

  it('getLangFromUrl falls back to default language when missing or invalid', async () => {
    const { getLangFromUrl } = await import('@i18n/utils')
    expect(getLangFromUrl(new URL('https://example.test/'))).toBe(defaultLang)
    expect(getLangFromUrl(new URL('https://example.test/xx/page'))).toBe(defaultLang)
  })

  it('useTranslations returns translations and undefined for unknown keys', async () => {
    const { useTranslations } = await import('@i18n/utils')
    const tEs = useTranslations('es')
    expect(tEs('nav.about')).toBe(ui.es['nav.about'])

    const tEn = useTranslations('en')
    expect(tEn('nav.blog')).toBe(ui.en['nav.blog'])

    // unknown key should return undefined (runtime)
    // intentionally pass an invalid key to test runtime behavior
    // @ts-expect-error testing unknown translation key
    expect(tEn('non.existent')).toBeUndefined()
  })

  it('useTranslatedPath prefixes paths with language', async () => {
    const { useTranslatedPath } = await import('@i18n/utils')
    const translateEs = useTranslatedPath('es')
    expect(translateEs('/about')).toBe('/es/about')

    const translateEn = useTranslatedPath('en')
    expect(translateEn('/post')).toBe('/en/post')
  })

  it('useTranslatedPath omits prefix when showDefaultLang=false', async () => {
    vi.resetModules()
    vi.doMock('@i18n/config', () => ({ showDefaultLang: false }))
    const { useTranslatedPath: useTranslatedPathFalse } = await import('@i18n/utils')

    const translateEs = useTranslatedPathFalse('es')
    expect(translateEs('/about')).toBe('/about')

    // restore modules for other tests
    vi.resetModules()
  })
})
