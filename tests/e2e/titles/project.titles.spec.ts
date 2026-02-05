import { test, expect } from '@playwright/test'
import { ContentListPage } from '@tests/pages/ContentListPage'
import { goto } from '@tests/actions/ContentListActions'
import { ui, type UILanguages } from '@i18n/ui'
import { sectionsConfig, type SectionType } from '@config/sections'

const locales = ['es', 'en'] as const
const section: SectionType = 'project'

test.describe('Project list title', () => {
  locales.forEach((locale) => {
    test(`project list title is correct (${locale})`, async ({ page }) => {
      const list = new ContentListPage(page)
      await goto(page, locale as UILanguages, section)

      const title = list.headerTitle()
      await expect(title).toBeVisible()
      const key = sectionsConfig[section].translationKey as keyof typeof ui['es']
      const expected = ui[locale][key]
      await expect(title).toHaveText(expected)
    })
  })
})
