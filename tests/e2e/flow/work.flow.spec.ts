import { test } from '@tests/fixtures'
import { languageKeys, type UILanguages } from '@i18n/ui'
import { userInWorkList } from '@tests/pages/content/WorkUserJourney'

const SLUG = 'perficient'

const expectedTitles: Record<UILanguages, string> = {
  es: 'Perficient Latinoamerica',
  en: 'Perficient Latinoamerica',
}

const expectedRoles: Record<UILanguages, string> = {
  es: 'Software developer engineer in test',
  en: 'Senior Technical Consultant',
}

test.describe('Work - flujo de navegación', { tag: ['@flow', '@work'] }, () => {
  for (const locale of languageKeys) {
    test(`navega de lista a detalle por click (${locale})`, async ({ Given, When, Then, And, page }) => {
      const list = await Given(userInWorkList(page, locale))
      const detail = await When(list.clickItem(SLUG))
      await Then(detail.shouldHaveTitle(expectedTitles[locale]))
      await And(detail.shouldHaveRole(expectedRoles[locale]))
    })
  }
})
