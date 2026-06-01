import { test } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { userInContentList, userInContentDetail } from '@tests/pages/a11y/A11yUserJourney'

test.describe('A11y - Work', { tag: ['@a11y', '@work'] }, () => {
  languageKeys.forEach((locale) => {
    test(`work list a11y (${locale})`, async ({ Given, When, Then, page }) => {
      const journey = await Given(userInContentList(page, locale, 'work'))
      const listingResults = await When(journey.auditA11y())
      await Then(journey.shouldPassAudit(listingResults))
    })

    test(`work detail a11y (${locale})`, async ({ Given, When, Then, page }) => {
      const journey = await Given(userInContentDetail(page, locale, 'work', 'perficient'))
      const detailResults = await When(journey.auditA11y())
      await Then(journey.shouldPassAudit(detailResults))
    })
  })
})
