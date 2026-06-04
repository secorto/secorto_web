import { test } from '@tests/fixtures'
import { languageKeys, type UILanguages } from '@i18n/ui'
import { userInCommunityList } from '@tests/pages/content/CommunityUserJourney'

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
    test(`navega de lista a detalle por click (${locale})`, { tag: [`@${locale}`] }, async ({ page }) => {
      const list = await userInCommunityList(page, locale)
      const detail = await list.clickItem(SLUG)
      await detail.shouldHaveTitle(expectedTitles[locale])
      await detail.shouldHaveRole(expectedRoles[locale])
    })
  }
})
