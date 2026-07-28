import { test } from '@tests/fixtures'
import { languageKeys, ui } from '@i18n/ui'
import { userInBlogList } from '@tests/support/ui/content/flows/BlogFlow'

for (const locale of languageKeys) {
  test.describe(`Blog - Tags (${locale})`, { tag: ['@blog', '@tags', `@${locale}`] }, () => {
    test('renders available tags in list', async ({ page }) => {
      const list = await userInBlogList(page, locale)
      await list.shouldRenderTagsForSection()
    })

    test('filtering by tag updates page title and shows filtered results', async ({ page }) => {
      const list = await userInBlogList(page, locale)
      const expectedSectionTitle = ui[locale]['nav.blog']
      await list.filterByTag('python')
      await list.shouldHaveFilteredTitle(expectedSectionTitle, 'python').soft()
      await list.shouldHaveFilteredResults().soft()
    })
  })
}
