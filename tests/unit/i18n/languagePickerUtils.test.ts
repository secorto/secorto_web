import { describe, it, expect, vi } from 'vitest'

const baseTranslationStructures = {
  blog: {
    seriesByKey: {},
    slugIndex: {},
    slugMeta: {
      '2025-01-01-title': {},
      '2025-02-01-title': {},
    },
  },
}

describe('languagePickerUtils', () => {
  it('buildHomeLink respects showDefaultLang', async () => {
    vi.resetModules()
    // Mock only the config flag, keep real ui exports
    await vi.doMock('@i18n/config', () => ({ showDefaultLang: true }))
    vi.doMock('@i18n/translations', () => ({ translationStructures: baseTranslationStructures }))
    const { buildHomeLink } = await import('@i18n/languagePickerUtils')
    const en = buildHomeLink('en')
    expect(en.href).toBe('/en/')

    vi.resetModules()
    await vi.doMock('@i18n/config', () => ({ showDefaultLang: false }))
    vi.doMock('@i18n/translations', () => ({ translationStructures: baseTranslationStructures }))
    const mod = await import('@i18n/languagePickerUtils')
    // defaultLang is 'es' — when showDefaultLang is false the default language omits the prefix
    expect(mod.buildHomeLink('es').href).toBe('/')
  })

  it('buildDetailLink for available translation', async () => {
    vi.resetModules()
    await vi.doMock('@i18n/config', () => ({ showDefaultLang: true }))
    vi.doMock('@i18n/translations', () => ({ translationStructures: baseTranslationStructures }))
    const { buildDetailLink } = await import('@i18n/languagePickerUtils')
    const availableLocales: Record<string, { slug: string; draft?: boolean }> = { en: { slug: 'en-slug' } }
    const link = buildDetailLink('en', 'blog', '2025-02-01-title', availableLocales)
    expect(link.isAvailable).toBe(true)
    expect(link.href).toBe('/en/blog/en-slug')
  })

  it('buildDetailLink marks missing translation', async () => {
    vi.resetModules()
    await vi.doMock('@i18n/config', () => ({ showDefaultLang: true }))
    const missingMeta = { '2025-03-01-title': {} }
    vi.doMock('@i18n/translations', () => ({ translationStructures: { ...baseTranslationStructures, blog: { ...baseTranslationStructures.blog, slugMeta: missingMeta } } }))
    const { buildDetailLink } = await import('@i18n/languagePickerUtils')
    const link = buildDetailLink('en', 'blog', '2025-03-01-title', {})
    expect(link.isAvailable).toBe(false)
    expect(link.disabledReason).toBe('missing')
  })
})
