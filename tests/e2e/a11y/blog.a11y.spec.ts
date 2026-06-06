import { test } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { userInContentList, userInContentTag, userInContentDetail } from '@tests/support/ui/a11y/A11yPage'

test.describe('A11y - Blog', { tag: ['@a11y', '@blog'] }, () => {
  languageKeys.forEach((locale) => {
    test(`blog list a11y (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const listPage = await userInContentList(page, locale, 'blog')
      const listingResults = await listPage.auditA11y()
      await listPage.shouldPassAudit(listingResults)
    })

    test(`blog tag a11y (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const tagPage = await userInContentTag(page, locale, 'blog', 'python')
      const tagResults = await tagPage.auditA11y()
      await tagPage.shouldPassAudit(tagResults)
    })

    test(`blog detail a11y (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const detailPage = await userInContentDetail(page, locale, 'blog', '2022-07-11-intro-python')
      const detailResults = await detailPage.auditA11y()
      await detailPage.shouldPassAudit(detailResults)
    })
  })
})
