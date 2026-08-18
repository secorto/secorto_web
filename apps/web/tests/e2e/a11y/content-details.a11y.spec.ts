import { test } from '@tests/fixtures'
import { userInContentDetail } from '@tests/support/ui/shared/flows/a11yNavigate'
import { testContents } from '@tests/support/data/testContents'

testContents.forEach((content) => {
  test.describe(`@a11y @content-${content.name} @${content.locale}`, () => {
    test(`@content-details @${content.testSlug}`, async ({ page }) => {
      const detailA11yFlow = await userInContentDetail(page, content.locale, content.name, content.testSlug)
      await detailA11yFlow.audit()
    })
  })
})
