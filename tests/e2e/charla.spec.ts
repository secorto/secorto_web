import { test, expect } from '@playwright/test'
import { ContentListPage } from '@tests/pages/ContentListPage'
import { ui } from '@i18n/ui'
import { goto, openItem } from '@tests/actions/ContentListActions'

const locales = ['es', 'en'] as const
const expectedTitles: Record<typeof locales[number], string> = {
  es: 'Devcontainers en localhost',
  en: 'Devcontainers on localhost'
}

test.describe('Charlas', () => {
  for (const locale of locales) {
    test(`Permite navegar por categorías y ver una charla (${locale})`, async ({ page }) => {
      const list = new ContentListPage(page)
      await goto(page, locale, 'talk')

      // Verifica título y encabezado principal (i18n)
      await expect(page).toHaveTitle(`${ui[locale]['nav.talks']} | SeCOrTo`)
      await expect(list.headerTitle()).toHaveText(ui[locale]['nav.talks'])

      // Interactúa con la categoría "containers"
      const containersTag = list.tagLink('containers')
      await expect(containersTag).not.toHaveClass(/active/)
      await containersTag.click()
      await expect(containersTag).toHaveClass(/active/)
      await expect(list.headerTitle()).toHaveText(`${ui[locale]['nav.talks']} - containers`)

      // Accede a la charla de Devcontainers
      await openItem(list, locale, 'talk', '2023-09-27-devcontainers')
      await expect(page.locator('header h1')).toHaveText(expectedTitles[locale])
    })
  }
})
