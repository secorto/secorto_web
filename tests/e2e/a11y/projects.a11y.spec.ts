import { test } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { userInContentList, userInContentDetail } from '@tests/support/pages/a11y/A11yPage'

test.describe('A11y - Projects', { tag: ['@a11y', '@projects'] }, () => {
  languageKeys.forEach((locale) => {
    test(`projects list a11y (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const listPage = await userInContentList(page, locale, 'projects')
      const listingResults = await listPage.auditA11y()
      await listPage.shouldPassAudit(listingResults)
    })

    test(`project detail a11y (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const detailPage = await userInContentDetail(page, locale, 'projects', 'scot3004')
      const detailResults = await detailPage.auditA11y()
      await detailPage.shouldPassAudit(detailResults)
    })
  })
})
