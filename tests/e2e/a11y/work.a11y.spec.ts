import { test } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { userInContentList, userInContentDetail } from '@tests/pages/a11y/A11yUserJourney'

test.describe('A11y - Work', { tag: ['@a11y', '@work'] }, () => {
  languageKeys.forEach((locale) => {
    test(`work list a11y (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const journey = await userInContentList(page, locale, 'work')
      const listingResults = await journey.auditA11y()
      await journey.shouldPassAudit(listingResults)
    })

    test(`work detail a11y (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const journey = await userInContentDetail(page, locale, 'work', 'perficient')
      const detailResults = await journey.auditA11y()
      await journey.shouldPassAudit(detailResults)
    })
  })
})
