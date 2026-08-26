import { test } from '@tests/fixtures'
import { userInTags } from '@tests/support/ui/tags/TagsPage'
import { enabledA11yLanguages } from '@tests/support/data/a11yLanguages'

enabledA11yLanguages.forEach((locale) => {
  test.describe(`@a11y @tags @${locale}`, () => {
    test('@global-tags', async ({ page }) => {
      const tagsPageObj = await userInTags(page, locale)
      await tagsPageObj.auditA11y()
    })
  })
})
