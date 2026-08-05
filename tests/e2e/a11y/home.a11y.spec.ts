import { test } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { userInHome } from '@tests/support/ui/home/pages/HomePage'

test.describe('@a11y - @home', () => {
  languageKeys.forEach((locale) => {
    test(`home page a11y @${locale}`, async ({ page }) => {
      const homePage = await userInHome(page, locale)
      await homePage.auditA11y()
    })
  })
})
