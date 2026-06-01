import { test } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { userInHome } from '@tests/pages/home/ThemeLocaleUserJourney'

for (const locale of languageKeys) {
  test(`smoke: html lang attribute is set for ${locale}`, { tag: ['@smoke', '@i18n', `@${locale}`] }, async ({ Given, Then, page }) => {
    const home = await Given(userInHome(page, locale))
    await Then(home.shouldHaveLang(locale))
  })
}
