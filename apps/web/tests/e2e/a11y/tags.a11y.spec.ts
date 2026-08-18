import { test } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { userInTags } from '@tests/support/ui/shared/flows/a11yNavigate'


test.describe('@a11y @global-tags', () => {
  languageKeys.forEach((locale) => {
    test(`tags list a11y @${locale}`, async ({ page }) => {
      const tagsA11yAudit = await userInTags(page, locale)
      await tagsA11yAudit.audit()
    })
  })
})
