import { test, expect } from '@playwright/test'
import { SidebarPage } from '@tests/pages/SidebarPage'

test.use({ colorScheme: 'light' })

test.describe('Color switch', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('toggles between light and dark mode', async ({ page }) => {
    const sidebar = new SidebarPage(page)
    const html = page.locator('html')

    // Initial state
    await expect(html).not.toHaveClass(/dark/)

    // capture the SVG circle transform before and after the toggle
    const themeCircle = page.locator('[data-testid="theme-toggle"] svg circle')
    const initialIsDark = await page.evaluate(() => document.documentElement.classList.contains('dark'))
    const initialTransform = await themeCircle.evaluate((el: Element) => getComputedStyle(el as Element).transform)

    // toggle -> the "dark" class should be added or removed
    await sidebar.getThemeToggle().click()
    await expect(html).toHaveClass(initialIsDark ? /light/ : /dark/)

    const afterTransform = await themeCircle.evaluate((el: Element) => getComputedStyle(el as Element).transform)
    expect(afterTransform).not.toBe(initialTransform)

    // toggle again -> return to initial state
    await sidebar.getThemeToggle().click()
    await expect(html).not.toHaveClass(/dark/)
  })
})
