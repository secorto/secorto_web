import { test } from '@tests/fixtures'
import { defaultLang } from '@i18n/ui'
import { userInTags } from '@tests/support/ui/shared/flows/a11yNavigate'

test.describe('@a11y @global-tags', () => {
  test(`tags list a11y @${defaultLang}`, async ({ page }) => {
    const tagsA11yAudit = await userInTags(page, defaultLang)
    await tagsA11yAudit.audit()
  })
})
