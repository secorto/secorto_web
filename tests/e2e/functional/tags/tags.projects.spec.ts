import { test } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { userInProjectList } from '@tests/pages/content/ProjectUserJourney'

for (const locale of languageKeys) {
  test(`Tags - Project (${locale})`,
    {tag: ['@project', '@tags']},
    async ({ When, Then, page }) => {
      const journey = await When(userInProjectList(page, locale))
      await Then(journey.verifyTagsForSection())
    })
}

