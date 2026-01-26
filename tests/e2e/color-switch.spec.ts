import { test, expect } from '@playwright/test'
import { SidebarPage } from '../pages/SidebarPage'

test.use({ colorScheme: 'light' })

test.describe('Color switch', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('Permite alternar entre modo claro y oscuro', async ({ page }) => {
    const sidebar = new SidebarPage(page)
    const html = page.locator('html')

    // Estado inicial
    await expect(html).not.toHaveClass(/dark/)

    // capturar transform del círculo del SVG antes y después del toggle
    const themeCircle = page.locator('[data-testid="theme-toggle"] svg circle')
    const initialIsDark = await page.evaluate(() => document.documentElement.classList.contains('dark'))
    const initialTransform = await themeCircle.evaluate((el: Element) => getComputedStyle(el as Element).transform)

    // toggle -> debe añadirse la clase dark
    await sidebar.getThemeToggle().click()
    await expect(html).toHaveClass(initialIsDark ? /light/ : /dark/)

    const afterTransform = await themeCircle.evaluate((el: Element) => getComputedStyle(el as Element).transform)
    expect(afterTransform).not.toBe(initialTransform)

    // toggle de nuevo -> volver a estado inicial
    await sidebar.getThemeToggle().click()
    await expect(html).not.toHaveClass(/dark/)
  })
})
