import { test } from '@tests/fixtures'
import { userInHome } from '@tests/support/ui/home/pages/HomePage'
import { enabledA11yLanguages } from '@tests/support/data/a11yLanguages'

enabledA11yLanguages.forEach((locale) => {
  test.describe(`@a11y - @home @${locale}`, () => {
    test('home page a11y', async ({ page }) => {
      const homePage = await userInHome(page, locale)
      await homePage.auditA11y()
    })
  })
})
