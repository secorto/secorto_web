import { test } from '@tests/fixtures'
import { userInContentList } from '@tests/support/ui/shared/flows/a11yNavigate'
import { sectionKeys } from '@domain/section'
import { enabledA11yLanguages } from '@tests/support/data/a11yLanguages'

enabledA11yLanguages.forEach((locale) => {
  sectionKeys.forEach((section) => {
    test.describe(`@a11y @content-${section} @${locale}`, () => {
      test('@content-list', async ({ page }) => {
        const listA11yFlow = await userInContentList(page, locale, section)
        await listA11yFlow.audit()
      })
    })
  })
})

