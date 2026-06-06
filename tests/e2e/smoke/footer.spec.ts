import { test } from '@tests/fixtures'
import { languageKeys, ui } from '@i18n/ui'
import { userInHome } from '@tests/support/pages/home/FooterPage'


test.describe('Footer translations', { tag: ['@smoke', '@home'] }, () => {
  languageKeys.forEach((locale) => {
    test(`footer texts are correct (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const homePage = await userInHome(page, locale)
      await homePage.shouldHaveAvatarAlt(ui[locale]['footer.avatar_alt'])
      await homePage.shouldHaveRoleText(ui[locale]['footer.role'])
      await homePage.shouldHaveFollowText(ui[locale]['footer.follow'])
      await homePage.shouldHaveAvatarLoaded()
    })
  })
})
