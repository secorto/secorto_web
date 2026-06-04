import { test } from '@tests/fixtures'
import { languageKeys } from '@i18n/ui'
import { userInTalkList } from '@tests/pages/content/TalkUserJourney'

for (const locale of languageKeys) {
  test(`Tags - Talk (${locale})`,
    {tag: ['@talk', '@tags', `@${locale}`]},
    async ({ page }) => {
      const list = await userInTalkList(page, locale)
      await list.shouldRenderTagsForSection()
    })
}
