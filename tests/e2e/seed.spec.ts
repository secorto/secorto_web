/**
 * Seed smoke test — punto de partida para nuevos tests generados por agentes.
 * Demuestra los patrones del proyecto: i18n, data-testid, navegación básica.
 * Reemplaza o extiende este archivo con los tests específicos que necesites.
 */
import { test, expect } from '@playwright/test'
import { languageKeys, ui } from '@i18n/ui'

test.describe('Smoke — homepage por locale', () => {
  for (const locale of languageKeys) {
    test(`carga la página de inicio (${locale})`, async ({ page }) => {
      await page.goto(`/${locale}/`)

      // Título del sitio
      await expect(page).toHaveTitle(/SeCOrTo/)

      // Sidebar visible con enlace About localizado
      const aboutLink = page.getByTestId('sidebar-about')
      await expect(aboutLink).toBeVisible()
      await expect(aboutLink).toHaveText(ui[locale]['nav.about'])

      // Footer visible
      await expect(page.getByTestId('footer-role')).toBeVisible()
    })
  }
})
