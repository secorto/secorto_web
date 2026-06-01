import { test } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { userInHome as userInColorSwitch } from '@tests/pages/home/ColorSwitchUserJourney'

for (const locale of languageKeys) {
  test(`smoke: html lang attribute is set for ${locale}`, async ({ Given, Then, page }) => {
    const home = await Given(userInColorSwitch(page, locale))
    await Then(home.shouldHaveLang(locale))
  })
}
