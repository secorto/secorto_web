import { test } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { userInContentList, userInContentTag, userInContentDetail, userInTags } from '@tests/pages/a11y/A11yUserJourney'


test.describe('A11y - Charlas', { tag: ['@a11y', '@talk'] }, () => {
  languageKeys.forEach((locale) => {
    test(`tags list a11y (global tags) (${locale})`, async ({ Given, When, Then, page }) => {
      const journey = await Given(userInTags(page, locale))
      const tagsResults = await When(journey.auditA11y())
      await Then(journey.shouldPassAudit(tagsResults))
    })

    test(`charla list a11y (${locale})`, async ({ Given, When, Then, page }) => {
      const journey = await Given(userInContentList(page, locale, 'talk'))
      const listingResults = await When(journey.auditA11y())
      await Then(journey.shouldPassAudit(listingResults))
    })

    test(`charla tag a11y (${locale})`, async ({ Given, When, Then, page }) => {
      const journey = await Given(userInContentTag(page, locale, 'talk'))
      const tagResults = await When(journey.auditA11y())
      await Then(journey.shouldPassAudit(tagResults))
    })

    test(`charla detail a11y (${locale})`, async ({ Given, When, Then, page }) => {
      const journey = await Given(userInContentDetail(page, locale, 'talk', '2023-09-27-devcontainers'))
      const detailResults = await When(journey.auditA11y())
      await Then(journey.shouldPassAudit(detailResults))
    })
  })
})
