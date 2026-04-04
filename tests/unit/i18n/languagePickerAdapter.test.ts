import { describe, it, expect } from 'vitest'
import type { TranslationLink } from '@domain/translationLink'
import { adaptLanguageLinks } from '@i18n/languagePickerAdapter'
import { languages, ui, icons } from '@i18n/ui'

describe('languagePickerAdapter', () => {
  it('adapts an available link to a LanguagePickerItem with no reason', () => {
    const links: TranslationLink[] = [ { type: 'available', href: '/en/', locale: 'en' } ]

    const adapted = adaptLanguageLinks(links)
    expect(adapted).toHaveLength(1)
    const item = adapted[0]

    expect(item.label).toBe(languages.en)
    expect(item.reason).toBe('')
    expect(item.text).toBe(languages.en)
    expect(item.title).toBeUndefined()
    expect(item.reasonId).toBeUndefined()
    expect(item.href).toBe('/en/')
    expect(item.accessible).toBe(true)
  })

  it('adapts a draft link showing draft marker and title', () => {
    const links: TranslationLink[] = [ { type: 'draft', href: '/en/draft', locale: 'en' } ]

    const adapted = adaptLanguageLinks(links)
    const item = adapted[0]

    expect(item.label).toBe(languages.en)
    expect(item.reason).toBe('draft')
    expect(item.text).toBe(`${languages.en} ${icons.draft}`)
    expect(item.title).toBe(ui.en['translation.disabled.draft'])
    expect(item.reasonId).toBe(`lang-en-reason`)
    expect(item.href).toBe('/en/draft')
    expect(item.accessible).toBe(true)
  })

  it('adapts a missing link showing missing marker and not accessible', () => {
    const links: TranslationLink[] = [ { type: 'missing', href: null, locale: 'es' } ]

    const adapted = adaptLanguageLinks(links)
    const item = adapted[0]

    expect(item.label).toBe(languages.es)
    expect(item.reason).toBe('missing')
    expect(item.text).toBe(`${languages.es} ${icons.missing}`)
    expect(item.title).toBe(ui.es['translation.disabled.missing'])
    expect(item.reasonId).toBe(`lang-es-reason`)
    expect(item.href).toBeNull()
    expect(item.accessible).toBe(false)
  })
})
