import { test, expect } from '@playwright/test'
import { languageKeys, ui } from '@i18n/ui'


test.describe('Footer translations', () => {
  languageKeys.forEach((locale) => {
    test(`footer texts are correct (${locale})`, async ({ page }) => {
      await page.goto(`/${locale}/`)

      const expectedAlt = ui[locale]['footer.avatar_alt']
      const expectedRole = ui[locale]['footer.role']
      const expectedFollow = ui[locale]['footer.follow']
      // image alt
      const img = page.locator('[data-testid="footer-avatar"]')
      await expect(img).toBeVisible()
      expect(await img.getAttribute('alt')).toBe(expectedAlt)

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
