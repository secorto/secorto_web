import { test } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { userInTalk, userInTalkTag, userInTalkDetail, userInTags } from '@tests/pages/A11yUserJourney'


test.describe('A11y - Charlas', { tag: ['@a11y', '@talk'] }, () => {
  languageKeys.forEach((locale) => {
    test(`tags list a11y (global tags) (${locale})`, async ({ Given, When, Then, page }) => {
      const journey = await Given(userInTags(page, locale))
      const tagsResults = await When(journey.auditA11y())
      await Then(journey.shouldPassAudit(tagsResults))
    })

    test(`charla list a11y (${locale})`, async ({ Given, When, Then, page }) => {
      const journey = await Given(userInTalk(page, locale))
      const listingResults = await When(journey.auditA11y())
      await Then(journey.shouldPassAudit(listingResults))
    })

    test(`charla tag a11y (${locale})`, async ({ Given, When, Then, page }) => {
      const journey = await Given(userInTalkTag(page, locale))
      const tagResults = await When(journey.auditA11y())
      await Then(journey.shouldPassAudit(tagResults))
    })

    test(`charla detail a11y (${locale})`, async ({ Given, When, Then, page }) => {
      const journey = await Given(userInTalkDetail(page, locale))
      const detailResults = await When(journey.auditA11y([
        '[data-testid="post-video"]',
        '[data-testid="post-slide"]',
        '[data-testid="comments-section"]'
      ]))
      await Then(journey.shouldPassAudit(detailResults))
    })
  })
})
