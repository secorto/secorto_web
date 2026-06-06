import { test } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { userInContentList, userInContentDetail } from '@tests/support/pages/a11y/A11yPage'

test.describe('A11y - Work', { tag: ['@a11y', '@work'] }, () => {
  languageKeys.forEach((locale) => {
    test(`work list a11y (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const listPage = await userInContentList(page, locale, 'work')
      const listingResults = await listPage.auditA11y()
      await listPage.shouldPassAudit(listingResults)
    })

    test(`work detail a11y (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const detailPage = await userInContentDetail(page, locale, 'work', 'perficient')
      const detailResults = await detailPage.auditA11y()
      await detailPage.shouldPassAudit(detailResults)
    })
  })
})
