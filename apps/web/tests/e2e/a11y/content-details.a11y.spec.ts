import { test } from '@tests/fixtures'
import { a11yTestContents } from '@tests/support/data/testContents'
import { userIsOnContentDetail } from '@tests/support/ui/content/ContentDetailPage'

a11yTestContents.forEach((content) => {
  test.describe(`@a11y @content-${content.name} @${content.locale}`, () => {
    test(`@content-details @${content.testSlug}`, async ({ page }) => {
      const detailPage = await userIsOnContentDetail(page, content.name, content.locale, content.testSlug)
      await detailPage.auditA11y()
    })
  })
})
