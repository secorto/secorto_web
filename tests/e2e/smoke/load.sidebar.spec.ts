import { test, expect } from '@playwright/test'

test('smoke: homepage (es) carga y sidebar muestra logo/imagen', async ({ page }) => {
  await page.goto('/es')
  await page.waitForLoadState('domcontentloaded')

  const lang = await page.getAttribute('html', 'lang')
  expect(lang, 'HTML lang attribute').toBe('es')

  const titleLocator = page.locator('[data-testid="sidebar-title"]')
  await expect(titleLocator, 'Sidebar title').toHaveCount(1)
  await expect(titleLocator, 'Sidebar title').not.toHaveText('')

  // Deterministic checks based on build output with clear error messages
  await expect(page.locator('nav.sidebar svg.sidebar-logo'), 'Sidebar logo').toHaveCount(1)

  const avatar = page.locator('img[data-testid="footer-avatar"]')
  await expect(avatar, 'Footer avatar').toHaveCount(1)

  await expect
    .poll(
      async () =>
        avatar.evaluate((img: HTMLImageElement) =>
          img.complete && img.naturalWidth > 0 ? img.naturalWidth : 0
        ),
      {
        message: 'Footer avatar image should be loaded',
        timeout: 10000,
      }
    )
    .toBeGreaterThan(0)
})
