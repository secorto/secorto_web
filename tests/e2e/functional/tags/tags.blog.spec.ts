import { test } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { userInBlogList } from '@tests/pages/content/BlogUserJourney'

for (const locale of languageKeys) {
  test(`Tags - Blog (${locale})`,
    {tag: ['@blog', '@tags', `@${locale}`]},
    async ({ page }) => {
      const journey = await userInBlogList(page, locale)
      await journey.verifyTagsForSection()
    })
}
