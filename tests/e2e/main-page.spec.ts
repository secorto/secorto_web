import { test, expect } from '@playwright/test'

import { ui, languageKeys } from '../../src/i18n/ui'
import { SidebarPage } from '../pages/SidebarPage'

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
        const sidebar = new SidebarPage(page)

        // Menú en escritorio
        await expect(sidebar.getHamburger()).not.toBeVisible()

        // comprueba texto del enlace de navegación 'about' usando strings tipadas de ui
        const aboutLink = page.getByTestId('sidebar-about')
        await expect(aboutLink).toHaveText(ui[locale]['nav.about'])

        // Cambia a vista móvil y verifica menú lateral
        await page.setViewportSize({ width: 375, height: 667 })
        await expect(sidebar.getHamburger()).toBeVisible()
        await sidebar.getHamburger().click()
        await expect(sidebar.getSidebarTitle()).toHaveText('Sergio Carlos Orozco Torres')
      })
    })
  }
})
