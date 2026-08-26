import { test } from '@tests/fixtures'
import type { UILanguages } from '@i18n/ui'
import { userInTags } from '@tests/support/ui/tags/TagsPage'

const locales: UILanguages[] = ['es', 'en']

test.describe('Global tags page', { tag: ['@functional', '@tags'] }, () => {
  for (const locale of locales) {
    test(
      `loads and is localized in ${locale}`,
      { tag: [`@${locale}`] },
      async ({ page }) => {
        const tagsPageObj = await userInTags(page, locale)
        await tagsPageObj.shouldBeLocalized(locale).soft()
      },
    )
  }
})
