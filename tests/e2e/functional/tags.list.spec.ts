import { test } from '@tests/fixtures'
import { userIsOnTags } from '@tests/support/ui/content/pages/TagsPage'
import { languageKeys, type UILanguages } from '@i18n/ui'

const fixtures: UILanguages[] = languageKeys

for (const locale of fixtures) {
  test.describe(`Tags list (${locale})`, { tag: ['@functional', '@tags', `@${locale}`] }, () => {
    test('page loaded correctly', async ({ page }) => {
      const tagsPage = await userIsOnTags(page, locale)
      await tagsPage.shouldBeLoaded(locale).soft()
    })
  })
}


