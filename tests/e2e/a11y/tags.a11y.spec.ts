import { test, expect } from '@playwright/test'
import { checkA11y } from '@tests/actions/A11yActions'
import { languageKeys } from '@i18n/ui'

test.describe('A11y - Tags', () => {
  languageKeys.forEach((locale) => {
    test(`tags list a11y (${locale})`, async ({ page }) => {
      await page.goto(`/${locale}/tags`)
      const tagsResults = await checkA11y()({ page })
      expect(tagsResults.violations).toEqual([])
    })
  })
})
