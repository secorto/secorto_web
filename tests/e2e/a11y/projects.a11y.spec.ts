import { test } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { userInContentList, userInContentDetail } from '@tests/pages/a11y/A11yUserJourney'

test.describe('A11y - Projects', { tag: ['@a11y', '@projects'] }, () => {
  languageKeys.forEach((locale) => {
    test(`projects list a11y (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const journey = await userInContentList(page, locale, 'projects')
      const listingResults = await journey.auditA11y()
      await journey.shouldPassAudit(listingResults)
    })

    test(`project detail a11y (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const journey = await userInContentDetail(page, locale, 'projects', 'scot3004')
      const detailResults = await journey.auditA11y()
      await journey.shouldPassAudit(detailResults)
    })
  })
})
