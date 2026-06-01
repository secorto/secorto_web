import { test } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { userInHome } from '@tests/pages/a11y/A11yUserJourney'


test.describe('A11y - Home', { tag: ['@a11y', '@home'] }, () => {
  languageKeys.forEach((locale) => {
    test(`home page a11y (${locale})`, { tag: [`@${locale}`] }, async ({ Given, When, Then, page }) => {
      const journey = await Given(userInHome(page, locale))
      const results = await When(journey.auditA11y())
      await Then(journey.shouldPassAudit(results))
    })
  })
})
