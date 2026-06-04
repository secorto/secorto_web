import { test } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { userInProjectList } from '@tests/pages/content/ProjectUserJourney'

for (const locale of languageKeys) {
  test(`Tags - Project (${locale})`,
    {tag: ['@project', '@tags', `@${locale}`]},
    async ({ page }) => {
      const journey = await userInProjectList(page, locale)
      await journey.verifyTagsForSection()
    })
}

