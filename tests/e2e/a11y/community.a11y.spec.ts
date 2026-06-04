import { test } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { userInContentList, userInContentDetail } from '@tests/pages/a11y/A11yUserJourney'

test.describe('A11y - Community', { tag: ['@a11y', '@community'] }, () => {
  languageKeys.forEach((locale) => {
    test(`community list a11y (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const journey = await userInContentList(page, locale, 'community')
      const listingResults = await journey.auditA11y()
      await journey.shouldPassAudit(listingResults)
    })

    test(`community detail a11y (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const journey = await userInContentDetail(page, locale, 'community', 'pybaq')
      const detailResults = await journey.auditA11y()
      await journey.shouldPassAudit(detailResults)
    })
  })
})
