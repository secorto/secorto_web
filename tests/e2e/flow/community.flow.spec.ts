import { test } from '@tests/fixtures'
import { languageKeys, type UILanguages } from '@i18n/ui'
import { userInCommunityList } from '@tests/pages/CommunityUserJourney'

const SLUG = 'pybaq'

const expectedTitles: Record<UILanguages, string> = {
  es: 'Python Barranquilla',
  en: 'Python Barranquilla',
}

const expectedRoles: Record<UILanguages, string> = {
  es: 'Front-End Developer, QA Speaker',
  en: 'Front-End Developer, QA Speaker',
}

test.describe('Community - flujo de navegación', { tag: ['@flow', '@community'] }, () => {
  for (const locale of languageKeys) {
    test(`navega de lista a detalle por click (${locale})`, async ({ Given, When, Then, And, page }) => {
      const list = await Given(userInCommunityList(page, locale))
      await Then(list.shouldHaveTitle())

      const detail = await When(list.clickItem(SLUG))
      await Then(detail.shouldHaveTitle(expectedTitles[locale]))
      await And(detail.shouldHaveRole(expectedRoles[locale]))
    })
  }
})
