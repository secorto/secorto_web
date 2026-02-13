import { test, expect } from '@playwright/test'
import { ContentListPage } from '@tests/pages/ContentListPage'
import { goto } from '@tests/actions/ContentListActions'
import { languageKeys, ui } from '@i18n/ui'
import { sectionsConfig, type SectionType } from '@config/sections'

const section: SectionType = 'community'

test.describe('Community list title', () => {
  languageKeys.forEach((locale) => {
    test(`community list title is correct (${locale})`, async ({ page }) => {
      const list = new ContentListPage(page)
      await goto(page, locale, section)

      const title = list.headerTitle()
      await expect(title).toBeVisible()
      const key = sectionsConfig[section].translationKey
      const expected = ui[locale][key]
      await expect(title).toHaveText(expected)
    })
  })
})
