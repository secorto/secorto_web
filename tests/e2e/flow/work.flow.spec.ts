import { test } from '@tests/fixtures'
import { languageKeys, type UILanguages } from '@i18n/ui'
import { userInWorkList } from '@tests/support/ui/content/WorkPages'
import { contentDetailsPath } from '@tests/support/ui/shared/NavigationPaths'
import { pageHelper } from '@tests/support/ui/components/PageHelper'

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
      const detailPath = contentDetailsPath('work', locale, SLUG)
      await list.clickItem(detailPath, `click work item "${SLUG}"`)
      await pageHelper(page).shouldHaveURL(detailPath)
      await list.shouldHaveDetailTitle(expectedTitles[locale])
      await list.shouldHaveRole(expectedRoles[locale])
    })
  }
})
