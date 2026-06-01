import { test } from '@tests/fixtures'
import { languageKeys, type UILanguages } from '@i18n/ui'
import { userInProjectList } from '@tests/pages/content/ProjectUserJourney'

const SLUG = 'scot3004'

const expectedTitles: Record<UILanguages, string> = {
  es: 'Sitio web personal',
  en: 'Personal website',
}

const expectedRoles: Record<UILanguages, string> = {
  es: 'Ingeniero de desarrollo',
  en: 'Development Engineer',
}

test.describe('Projects - flujo de navegación', { tag: ['@flow', '@projects'] }, () => {
  for (const locale of languageKeys) {
    test(`navega de lista a detalle por click (${locale})`, { tag: [`@${locale}`] }, async ({ Given, When, Then, And, page }) => {
      const list = await Given(userInProjectList(page, locale))
      const detail = await When(list.clickItem(SLUG))
      await Then(detail.shouldHaveTitle(expectedTitles[locale]))
      await And(detail.shouldHaveRole(expectedRoles[locale]))
    })
  }
})
