import { test, expect } from '@playwright/test'

import { ui, languageKeys } from '@i18n/ui'

test.describe('Página de inicio (locales)', () => {
  for (const locale of languageKeys) {
    test.describe(locale, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(`/${locale}`)
      })

      test('tiene título correcto', async ({ page }) => {
        await expect(page).toHaveTitle(/SeCOrTo/)
      })

      test('muestra enlace de navegación about con texto i18n', async ({ page }) => {
        const aboutLink = page.getByTestId('sidebar-about')
        await expect(aboutLink).toHaveText(ui[locale]['nav.about'])
      })
    })
  }
})
