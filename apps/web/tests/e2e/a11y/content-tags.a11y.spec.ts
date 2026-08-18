import { test } from '@tests/fixtures'
import { userInContentTag } from '@tests/support/ui/shared/flows/a11yNavigate'
import { a11yTestContents } from '@tests/support/data/testContents'

a11yTestContents.forEach((content) => {
  test.describe(`@a11y @content-${content.name} @${content.locale}`, () => {
    test(`@content-tags @${content.testTag}`, async ({ page }) => {
      const tagA11yFlow = await userInContentTag(page, content.locale, content.name, content.testTag)
      await tagA11yFlow.audit()
    })
  })
})
