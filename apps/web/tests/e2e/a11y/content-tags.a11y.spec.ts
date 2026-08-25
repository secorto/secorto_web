import { test } from '@tests/fixtures'
import { userInContentTag } from '@tests/support/ui/content/ContentListPage'
import { a11yTestContents } from '@tests/support/data/testContents'

a11yTestContents.forEach((content) => {
  test.describe(`@a11y @content-${content.name} @${content.locale}`, () => {
    test(`@content-tags @${content.testTag}`, async ({ page }) => {
      const tagA11yFlow = await userInContentTag(page, content.name, content.locale, content.testTag)
      await tagA11yFlow.auditA11y()
    })
  })
})
