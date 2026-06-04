import { test } from '@tests/fixtures'
import { languageKeys, type UILanguages } from '@i18n/ui'
import { userInProjectList } from '@tests/pages/content/ProjectPages'
import { contentDetailsPath } from '@tests/pages/shared/NavigationPaths'
import { pageHelper } from '@tests/pages/components/PageHelper'

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
      const detailPath = contentDetailsPath('projects', locale, SLUG)
      await list.clickItem(detailPath, `click project item "${SLUG}"`)
      await pageHelper(page).shouldHaveURL(detailPath)
      await list.shouldHaveDetailTitle(expectedTitles[locale])
      await list.shouldHaveRole(expectedRoles[locale])
    })
  }
})
