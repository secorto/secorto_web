import { test } from '@tests/fixtures'
import { userIsOnContentList } from '@tests/support/ui/content/ContentListPage'
import { sectionRoutes } from '@domain/section'
import { enabledA11yLanguages } from '@tests/support/data/a11yLanguages'

enabledA11yLanguages.forEach((locale) => {
  sectionRoutes.getSections().forEach((section) => {
    test.describe(`@a11y @content-${section} @${locale}`, () => {
      test('@content-list', async ({ page }) => {
        const listPage = await userIsOnContentList(page, section, locale)
        await listPage.auditA11y()
      })
    })
  })
})
