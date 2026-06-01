import { test } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { userInHome } from '@tests/pages/FooterUserJourney'


test.describe('Footer translations', () => {
  languageKeys.forEach((locale) => {
    test(`footer texts are correct (${locale})`, async ({ Given, Then, And, page }) => {
      const journey = await Given(userInHome(page, locale))
      await Then(journey.shouldHaveAvatarAlt())
      await And(journey.shouldHaveRoleText())
      await And(journey.shouldHaveFollowText())
    })
  })
})
