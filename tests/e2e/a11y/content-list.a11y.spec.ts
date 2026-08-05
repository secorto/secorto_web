import { test } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { userInContentList } from '@tests/support/ui/shared/flows/a11yNavigate'
import { sectionsConfig, type SectionType } from '@domain/section';

Object.keys(sectionsConfig).forEach(element => {
  languageKeys.forEach((locale) => {
    test.describe(`@a11y @content-${element} @${locale}`, () => {
      test(`@content-list`, async ({ page }) => {
        const listA11yFlow = await userInContentList(page, locale, element as SectionType)
        await listA11yFlow.audit()
      })
    })
  })
});

