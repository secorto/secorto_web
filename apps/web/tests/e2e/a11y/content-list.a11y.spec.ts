import { test } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { userInContentList } from '@tests/support/ui/shared/flows/a11yNavigate'
import { sectionKeys } from '@domain/section'

sectionKeys.forEach(section => {
  languageKeys.forEach((locale) => {
    test.describe(`@a11y @content-${section} @${locale}`, () => {
      test(`@content-list`, async ({ page }) => {
        const listA11yFlow = await userInContentList(page, locale, section)
        await listA11yFlow.audit()
      })
    })
  })
});

