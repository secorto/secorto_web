import { test } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { userInHome } from '@tests/pages/a11y/A11yPage'


test.describe('A11y - Home', { tag: ['@a11y', '@home'] }, () => {
  languageKeys.forEach((locale) => {
    test(`home page a11y (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const homePage = await userInHome(page, locale)
      const results = await homePage.auditA11y()
      await homePage.shouldPassAudit(results)
    })
  })
})
