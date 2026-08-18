import { test } from '@tests/fixtures'
import { defaultLang } from '@i18n/ui'
import { userInHome } from '@tests/support/ui/home/pages/HomePage'

test.describe('@a11y - @home', () => {
  test(`home page a11y @${defaultLang}`, async ({ page }) => {
    const homePage = await userInHome(page, defaultLang)
    await homePage.auditA11y()
  })
})
