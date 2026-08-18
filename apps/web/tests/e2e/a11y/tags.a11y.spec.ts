import { test } from '@tests/fixtures'
import { userInTags } from '@tests/support/ui/shared/flows/a11yNavigate'
import { enabledA11yLanguages } from '@tests/support/data/a11yLanguages'

enabledA11yLanguages.forEach((locale) => {
  test.describe(`@a11y @global-tags @${locale}`, () => {
    test('tags list a11y', async ({ page }) => {
      const tagsA11yAudit = await userInTags(page, locale)
      await tagsA11yAudit.audit()
    })
  })
})
