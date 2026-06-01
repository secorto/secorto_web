import { test } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { userInContentList, userInContentTag, userInContentDetail } from '@tests/pages/a11y/A11yUserJourney'

test.describe('A11y - Blog', { tag: ['@a11y', '@blog'] }, () => {
  languageKeys.forEach((locale) => {
    test(`blog list a11y (${locale})`, async ({ Given, When, Then, page }) => {
      const journey = await Given(userInContentList(page, locale, 'blog'))
      const listingResults = await When(journey.auditA11y())
      await Then(journey.shouldPassAudit(listingResults))
    })

    test(`blog tag a11y (${locale})`, async ({ Given, When, Then, page }) => {
      const journey = await Given(userInContentTag(page, locale, 'blog', 'python'))
      const tagResults = await When(journey.auditA11y())
      await Then(journey.shouldPassAudit(tagResults))
    })

    test(`blog detail a11y (${locale})`, async ({ Given, When, Then, page }) => {
      const journey = await Given(userInContentDetail(page, locale, 'blog', '2022-07-11-intro-python'))
      const detailResults = await When(journey.auditA11y())
      await Then(journey.shouldPassAudit(detailResults))
    })
  })
})
