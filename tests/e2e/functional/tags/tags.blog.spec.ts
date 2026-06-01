import { test } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { userInBlogList } from '@tests/pages/content/BlogUserJourney'

for (const locale of languageKeys) {
  test(`Tags - Blog (${locale})`,
    {tag: ['@blog', '@tags']},
    async ({ When, Then, page }) => {
      const journey = await When(userInBlogList(page, locale))
      await Then(journey.verifyTagsForSection())
    })
}
