import { test } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { userInHome } from '@tests/support/ui/home/ThemeLocaleHomePage'

for (const locale of languageKeys) {
  test(`smoke: html lang attribute is set for ${locale}`, { tag: ['@smoke', '@i18n', `@${locale}`] }, async ({ page }) => {
    const home = await userInHome(page, locale)
    await home.shouldHaveLang(locale)
  })
}
