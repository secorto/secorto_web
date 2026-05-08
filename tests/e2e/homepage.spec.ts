import { test, expect } from '@playwright/test'
import { ui, languageKeys } from '@i18n/ui'
import { HomePage } from '../pages/HomePage'

for (const locale of languageKeys) {
  test.describe(`@homepage Homepage (${locale})`, () => {
    let home: HomePage

    test.beforeEach(async ({ page }) => {
      home = new HomePage(page)
      await home.goto(locale)
    })

    test('renders bio, avatar and highlights', async () => {
      await expect(home.avatar()).toBeVisible()
      await expect(home.bioText()).toBeVisible()
      await expect(home.highlights()).toHaveCount(2)
    })

    test('PyBAQ callout uses i18n strings', async () => {
      const callout = home.pybaq()
      await expect(callout).toBeVisible()
      await expect(callout.getByText(ui[locale]['home.pybaq_role'])).toBeVisible()
      await expect(callout.getByText(ui[locale]['home.pybaq_since'])).toBeVisible()
      await expect(callout.getByText(ui[locale]['home.pybaq_cta'])).toBeVisible()
    })

    test('first highlight link navigates to content', async ({ page }) => {
      const first = home.firstHighlight()
      await expect(first).toBeVisible()
      const href = await first.getAttribute('href')
      expect(href).toBeTruthy()
      await page.goto(href || '/')
      await expect(page).not.toHaveURL(`/${locale}/`)
    })
  })
}
