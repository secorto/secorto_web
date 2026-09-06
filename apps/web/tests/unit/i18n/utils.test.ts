import { describe, it, expect } from 'vitest'
import { ui } from '@i18n/ui'

describe('i18n utils', () => {
  it('useTranslations returns translations and undefined for unknown keys', async () => {
    const { useTranslations } = await import('@i18n/utils')
    const tEs = useTranslations('es')
    expect(tEs('nav.about')).toBe(ui.es['nav.about'])

    const tEn = useTranslations('en')
    expect(tEn('nav.about')).toBe(ui.en['nav.about'])

    // @ts-expect-error testing unknown translation key
    expect(tEn('non.existent')).toBeUndefined()
  })
})
