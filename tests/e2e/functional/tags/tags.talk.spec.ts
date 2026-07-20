import { test, expect } from '@tests/fixtures'
import { languageKeys, ui } from '@i18n/ui'
import { userInTalkList } from '@tests/support/ui/content/TalkPages'

for (const locale of languageKeys) {
  test.describe(`Talk - Tags (${locale})`, { tag: ['@talk', '@tags', `@${locale}`] }, () => {
    test('renders available tags in list', async ({ page }) => {
      const list = await userInTalkList(page, locale)
      await list.shouldRenderTagsForSection()
    })

    test('filtering by tag updates page title', async ({ page }) => {
      const list = await userInTalkList(page, locale)
      const expectedSectionTitle = ui[locale]['nav.talks']

      await list.filterByTag('containers')
      await list.shouldHaveFilteredTitle(expectedSectionTitle, 'containers')
    })

    test('filtered talks exist after tag selection', async ({ page }) => {
      const list = await userInTalkList(page, locale)

      await list.filterByTag('containers')
      await list.shouldHaveFilteredResults()
    })
  })
}
