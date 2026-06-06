import { test } from '@tests/fixtures'
import { languageKeys, ui, type UILanguages } from '@i18n/ui'
import { userInBlogList } from '@tests/support/ui/content/BlogPages'
import { contentDetailsPath } from '@tests/support/ui/shared/NavigationPaths'
import { pageHelper } from '@tests/support/ui/components/PageHelper'

const SLUG = '2022-07-11-intro-python'
const TAG = 'python'

const expectedTitles: Record<UILanguages, string> = {
  es: 'Introducción a Python',
  en: 'Introduction to Python',
}

test.describe('Blog - flujo de navegación', { tag: ['@flow', '@blog'] }, () => {
  for (const locale of languageKeys) {
    test(`navega de lista a detalle via tag y click (${locale})`, { tag: [`@${locale}`] }, async ({
      page,
    }) => {
      const list = await userInBlogList(page, locale)
      const expectedSectionTitle = ui[locale]['nav.blog']

      await list.filterByTag(TAG)
      await list.shouldHaveFilteredTitle(expectedSectionTitle, TAG)

      const detailPath = contentDetailsPath('blog', locale, SLUG)
      await list.clickItem(detailPath, `click blog item "${SLUG}"`)
      await pageHelper(page).shouldHaveURL(detailPath)
      await list.shouldHaveDetailTitle(expectedTitles[locale])
    })
  }
})
