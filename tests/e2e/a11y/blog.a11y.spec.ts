import { test } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { userInContentList, userInContentTag, userInContentDetail } from '@tests/pages/a11y/A11yUserJourney'

test.describe('A11y - Blog', { tag: ['@a11y', '@blog'] }, () => {
  languageKeys.forEach((locale) => {
    test(`blog list a11y (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const journey = await userInContentList(page, locale, 'blog')
      const listingResults = await journey.auditA11y()
      await journey.shouldPassAudit(listingResults)
    })

    test(`blog tag a11y (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const journey = await userInContentTag(page, locale, 'blog', 'python')
      const tagResults = await journey.auditA11y()
      await journey.shouldPassAudit(tagResults)
    })

    test(`blog detail a11y (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const journey = await userInContentDetail(page, locale, 'blog', '2022-07-11-intro-python')
      const detailResults = await journey.auditA11y()
      await journey.shouldPassAudit(detailResults)
    })
  })
})
