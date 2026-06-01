import { test } from '@tests/fixtures'
import { languageKeys, type UILanguages } from '@i18n/ui'
import { userInBlogList } from '@tests/pages/content/BlogUserJourney'

const SLUG = '2022-07-11-intro-python'
const TAG = 'python'

const expectedTitles: Record<UILanguages, string> = {
  es: 'Introducción a Python',
  en: 'Introduction to Python',
}

test.describe('Blog - flujo de navegación', { tag: ['@flow', '@blog'] }, () => {
  for (const locale of languageKeys) {
    test(`navega de lista a detalle via tag y click (${locale})`, { tag: [`@${locale}`] }, async ({
      Given, When, Then, And, page,
    }) => {
      const list = await Given(userInBlogList(page, locale))

      await When(list.filterByTag(TAG))
      await And(list.shouldShowFilteredTitle(TAG))

      const detail = await When(list.clickItem(SLUG))
      await Then(detail.shouldHaveTitle(expectedTitles[locale]))
    })
  }
})
