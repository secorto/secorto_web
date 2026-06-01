import { test } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { userInContentList, userInContentDetail } from '@tests/pages/a11y/A11yUserJourney'

test.describe('A11y - Community', { tag: ['@a11y', '@community'] }, () => {
  languageKeys.forEach((locale) => {
    test(`community list a11y (${locale})`, async ({ Given, When, Then, page }) => {
      const journey = await Given(userInContentList(page, locale, 'community'))
      const listingResults = await When(journey.auditA11y())
      await Then(journey.shouldPassAudit(listingResults))
    })

    test(`community detail a11y (${locale})`, async ({ Given, When, Then, page }) => {
      const journey = await Given(userInContentDetail(page, locale, 'community', 'pybaq'))
      const detailResults = await When(journey.auditA11y())
      await Then(journey.shouldPassAudit(detailResults))
    })
  })
})
