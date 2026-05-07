import { test, expect } from '@playwright/test'
import { ui, languageKeys } from '@i18n/ui'

for (const locale of languageKeys) {
  test.describe(`Homepage (${locale})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/${locale}/`)
    })

    test('renders bio, avatar and highlights', async ({ page }) => {
      await expect(page.locator('.home-avatar svg')).toBeVisible()
      await expect(page.locator('.home-bio-text')).toBeVisible()

      // highlights (cards rendered from props)
      await expect(page.locator('[data-testid^="highlight-"]')).toHaveCount(2)
    })

    test('PyBAQ callout uses i18n strings', async ({ page }) => {
      const callout = page.locator('.pybaq-callout')
      await expect(callout).toBeVisible()
      await expect(callout.getByText(ui[locale]['home.pybaq_role'])).toBeVisible()
      await expect(callout.getByText(ui[locale]['home.pybaq_since'])).toBeVisible()
      await expect(callout.getByText(ui[locale]['home.pybaq_cta'])).toBeVisible()
    })

    test('first highlight link navigates to content', async ({ page }) => {
      const first = page.locator('[data-testid="highlight-0"]')
      await expect(first).toBeVisible()
      const href = await first.getAttribute('href')
      expect(href).toBeTruthy()
      await page.goto(href || '/')
      await expect(page).not.toHaveURL(`/${locale}/`)
    })
  })
}
