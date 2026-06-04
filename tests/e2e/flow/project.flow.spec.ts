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
    test(`navega de lista a detalle por click (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const list = await userInProjectList(page, locale)
      const detail = await list.clickItem(SLUG)
      await detail.shouldHaveTitle(expectedTitles[locale])
      await detail.shouldHaveRole(expectedRoles[locale])
    })
  }
})
