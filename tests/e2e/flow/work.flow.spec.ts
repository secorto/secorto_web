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
    test(`navega de lista a detalle por click (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const list = await userInWorkList(page, locale)
      const detail = await list.clickItem(SLUG)
      await detail.shouldHaveTitle(expectedTitles[locale])
      await detail.shouldHaveRole(expectedRoles[locale])
    })
  }
})
