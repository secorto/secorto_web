import { test, expect } from '@playwright/test'

import { ui, languageKeys } from '../../src/i18n/ui'

test.describe('Página de inicio (locales)', () => {
  // Usar las claves tipadas de `ui` para evitar errores de tipo
  const locales = languageKeys as Array<keyof typeof ui>

  for (const locale of locales) {
    test.describe(locale, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(`/${locale}`)
      })

      test('Verifica elementos principales y menú móvil', async ({ page }) => {
        // Verifica que exista un h1 (texto específico proviene de las páginas locales)
        await expect(page.locator('h1')).toHaveCount(1)

        // Menú en escritorio
        const hamburger = page.locator('.hamburger')
        await expect(hamburger).not.toBeVisible()

        // comprueba texto del enlace de navegación 'about' usando strings tipadas de ui
        const aboutLink = page.locator('[data-testid="sidebar-about"]')
        await expect(aboutLink).toHaveText(ui[locale]['nav.about'])

        // Cambia a vista móvil y verifica menú lateral
        await page.setViewportSize({ width: 375, height: 667 })
        const sidebarTitle = page.locator('.sidebar-title')
        await expect(hamburger).toBeVisible()
        await hamburger.click()
        await expect(sidebarTitle).toHaveText('Sergio Carlos Orozco Torres')
      })
    })
  }
})
