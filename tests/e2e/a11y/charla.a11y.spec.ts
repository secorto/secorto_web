import { test } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { userInContentList, userInContentTag, userInContentDetail, userInTags } from '@tests/pages/a11y/A11yUserJourney'


test.describe('A11y - Charlas', { tag: ['@a11y', '@talk'] }, () => {
  languageKeys.forEach((locale) => {
    test(`tags list a11y (global tags) (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const journey = await userInTags(page, locale)
      const tagsResults = await journey.auditA11y()
      await journey.shouldPassAudit(tagsResults)
    })

    test(`charla list a11y (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const journey = await userInContentList(page, locale, 'talk')
      const listingResults = await journey.auditA11y()
      await journey.shouldPassAudit(listingResults)
    })

    test(`charla tag a11y (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const journey = await userInContentTag(page, locale, 'talk')
      const tagResults = await journey.auditA11y()
      await journey.shouldPassAudit(tagResults)
    })

    test(`charla detail a11y (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const journey = await userInContentDetail(page, locale, 'talk', '2023-09-27-devcontainers')
      const detailResults = await journey.auditA11y()
      await journey.shouldPassAudit(detailResults)
    })
  })
})
