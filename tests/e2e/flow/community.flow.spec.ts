import { test } from '@tests/fixtures'
import { languageKeys, type UILanguages } from '@i18n/ui'
import { userInCommunityList } from '@tests/support/ui/content/CommunityPages'
import { contentDetailsPath } from '@tests/support/ui/shared/NavigationPaths'
import { pageHelper } from '@tests/support/ui/components/PageHelper'

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
      const detailPath = contentDetailsPath('community', locale, SLUG)
      await list.clickItem(detailPath, `click community item "${SLUG}"`)
      await pageHelper(page).shouldHaveURL(detailPath)
      await list.shouldHaveDetailTitle(expectedTitles[locale])
      await list.shouldHaveRole(expectedRoles[locale])
    })
  }
})
