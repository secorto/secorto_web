import { test } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { userInHome } from '@tests/support/ui/home/HomePage'

for (const locale of languageKeys) {
  test.describe(`Homepage (${locale})`,
    { tag: ['@home', '@smoke', `@${locale}`] },
    () => {
      test('loads correctly', async ({ page }) => {
        const home = await userInHome(page, locale)
        await home.shouldBeLoaded(locale).soft()
      })
    })
}
