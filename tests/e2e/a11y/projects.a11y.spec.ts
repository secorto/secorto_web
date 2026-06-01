import { test } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { userInContentList, userInContentDetail } from '@tests/pages/a11y/A11yUserJourney'

test.describe('A11y - Projects', { tag: ['@a11y', '@projects'] }, () => {
  languageKeys.forEach((locale) => {
    test(`projects list a11y (${locale})`, async ({ Given, When, Then, page }) => {
      const journey = await Given(userInContentList(page, locale, 'projects'))
      const listingResults = await When(journey.auditA11y())
      await Then(journey.shouldPassAudit(listingResults))
    })

    test(`project detail a11y (${locale})`, async ({ Given, When, Then, page }) => {
      const journey = await Given(userInContentDetail(page, locale, 'projects', 'scot3004'))
      const detailResults = await When(journey.auditA11y())
      await Then(journey.shouldPassAudit(detailResults))
    })
  })
})
