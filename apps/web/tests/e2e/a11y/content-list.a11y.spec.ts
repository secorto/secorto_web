import { test } from '@tests/fixtures'
import { defaultLang } from '@i18n/ui'
import { userInContentList } from '@tests/support/ui/shared/flows/a11yNavigate'
import { sectionKeys } from '@domain/section'

sectionKeys.forEach((section) => {
  test.describe(`@a11y @content-${section} @${defaultLang}`, () => {
    test(`@content-list`, async ({ page }) => {
      const listA11yFlow = await userInContentList(page, defaultLang, section)
      await listA11yFlow.audit()
    })
  })
})

