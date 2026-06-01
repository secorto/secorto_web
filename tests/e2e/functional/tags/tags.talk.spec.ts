import { test } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { userInTalkList } from '@tests/pages/content/TalkUserJourney'

for (const locale of languageKeys) {
  test(`Tags - Talk (${locale})`,
    {tag: ['@talk', '@tags']},
    async ({ When, Then, page }) => {
      const journey = await When(userInTalkList(page, locale))
      await Then(journey.verifyTagsForSection())
    })
}
