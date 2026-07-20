import { test } from '@tests/fixtures'
import { languageKeys, ui } from '@i18n/ui'
import { userInTalkList } from '@tests/support/ui/content/TalkPages'

for (const locale of languageKeys) {
  test.describe(`Talk - Tags (${locale})`, { tag: ['@talk', '@tags', `@${locale}`] }, () => {
    test('renders available tags in list', async ({ page }) => {
      const list = await userInTalkList(page, locale)
      await list.shouldRenderTagsForSection()
    })

    test('filtering by tag updates page title and shows filtered results', async ({ page }) => {
      const list = await userInTalkList(page, locale)
      const expectedSectionTitle = ui[locale]['nav.talks']
      await list.filterByTag('containers')
      await list.shouldHaveFilteredTitle(expectedSectionTitle, 'containers').soft()
      await list.shouldHaveFilteredResults().soft()
    })
  })
}
