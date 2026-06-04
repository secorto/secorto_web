import { test } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { userInContentList, userInContentTag, userInContentDetail, userInTags } from '@tests/pages/a11y/A11yPage'


test.describe('A11y - Charlas', { tag: ['@a11y', '@talk'] }, () => {
  languageKeys.forEach((locale) => {
    test(`tags list a11y (global tags) (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const tagsPage = await userInTags(page, locale)
      const tagsResults = await tagsPage.auditA11y()
      await tagsPage.shouldPassAudit(tagsResults)
    })

    test(`charla list a11y (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const listPage = await userInContentList(page, locale, 'talk')
      const listingResults = await listPage.auditA11y()
      await listPage.shouldPassAudit(listingResults)
    })

    test(`charla tag a11y (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const tagPage = await userInContentTag(page, locale, 'talk')
      const tagResults = await tagPage.auditA11y()
      await tagPage.shouldPassAudit(tagResults)
    })

    test(`charla detail a11y (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const detailPage = await userInContentDetail(page, locale, 'talk', '2023-09-27-devcontainers')
      const detailResults = await detailPage.auditA11y()
      await detailPage.shouldPassAudit(detailResults)
    })
  })
})
