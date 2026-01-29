import { test, expect } from '@playwright/test'
import { ui, type UILanguages } from '@i18n/ui'

const locales = ['es', 'en'] as const

test.describe('Footer translations', () => {
  locales.forEach((locale) => {
    test(`footer texts are correct (${locale})`, async ({ page }) => {
      await page.goto(`/${locale}/`)

      const expectedAlt = ui[locale as UILanguages]['footer.avatar_alt']
      const expectedRole = ui[locale as UILanguages]['footer.role']
      const expectedFollow = ui[locale as UILanguages]['footer.follow']

      // image alt
      const img = page.locator('[data-testid="footer-avatar"]')
      await expect(img).toBeVisible()
      await expect(await img.getAttribute('alt')).toBe(expectedAlt)

      // role text
      const role = page.getByTestId('footer-role')
      await expect(role).toBeVisible()
      await expect(role).toHaveText(expectedRole)

      // follow label
      const follow = page.getByTestId('footer-follow')
      await expect(follow).toBeVisible()
      await expect(follow).toHaveText(expectedFollow)
    })
  })
})
