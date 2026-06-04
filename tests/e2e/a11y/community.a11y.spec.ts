import { test } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { userInContentList, userInContentDetail } from '@tests/pages/a11y/A11yPage'

test.describe('A11y - Community', { tag: ['@a11y', '@community'] }, () => {
  languageKeys.forEach((locale) => {
    test(`community list a11y (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const listPage = await userInContentList(page, locale, 'community')
      const listingResults = await listPage.auditA11y()
      await listPage.shouldPassAudit(listingResults)
    })

    test(`community detail a11y (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const detailPage = await userInContentDetail(page, locale, 'community', 'pybaq')
      const detailResults = await detailPage.auditA11y()
      await detailPage.shouldPassAudit(detailResults)
    })
  })
})
