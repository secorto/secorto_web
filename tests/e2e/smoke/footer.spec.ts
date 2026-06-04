import { test } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { userInHome } from '@tests/pages/footer/FooterUserJourney'


test.describe('Footer translations', { tag: ['@smoke', '@home'] }, () => {
  languageKeys.forEach((locale) => {
    test(`footer texts are correct (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const homePage = await userInHome(page, locale)
      await homePage.shouldHaveAvatarAlt()
      await homePage.shouldHaveRoleText()
      await homePage.shouldHaveFollowText()
      await homePage.shouldHaveAvatarLoaded()
    })
  })
})
