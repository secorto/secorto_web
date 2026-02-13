import { test, expect } from '@playwright/test'

test.describe('Hamburger menu', () => {
  // Forzar viewport móvil para que el hamburger sea visible
  test.use({ viewport: { width: 375, height: 667 } })

  test('hamburger button is visible on mobile', async ({ page }) => {
    await page.goto('/es/')

    const hamburger = page.getByTestId('hamburger')
    await expect(hamburger).toBeVisible()
  })

  test('clicking hamburger opens sidebar', async ({ page }) => {
    await page.goto('/es/')

    const hamburger = page.getByTestId('hamburger')
    const sidebar = page.locator('.sidebar-toggle')

    // Sidebar should not have 'sidebar-open' class initially
    await expect(sidebar).not.toHaveClass(/sidebar-open/)

    // Click hamburger to open
    await hamburger.click()

    // Sidebar should now have 'sidebar-open' class
    await expect(sidebar).toHaveClass(/sidebar-open/)
  })

  test('clicking hamburger again closes sidebar', async ({ page }) => {
    await page.goto('/es/')

    const hamburger = page.getByTestId('hamburger')
    const sidebar = page.locator('.sidebar-toggle')

    // Open
    await hamburger.click()
    await expect(sidebar).toHaveClass(/sidebar-open/)

    // Close
    await hamburger.click()
    await expect(sidebar).not.toHaveClass(/sidebar-open/)
  })

  test('hamburger button toggles its own sidebar-open class', async ({ page }) => {
    await page.goto('/es/')

    const hamburger = page.getByTestId('hamburger')

    await expect(hamburger).not.toHaveClass(/sidebar-open/)

    await hamburger.click()
    await expect(hamburger).toHaveClass(/sidebar-open/)

    await hamburger.click()
    await expect(hamburger).not.toHaveClass(/sidebar-open/)
  })

  test('sidebar contains navigation links', async ({ page }) => {
    await page.goto('/es/')

    const hamburger = page.getByTestId('hamburger')
    await hamburger.click()

    const sidebar = page.locator('.sidebar-toggle')
    await expect(sidebar).toHaveClass(/sidebar-open/)

    // Verify sidebar has nav links
    const sidebarTitle = page.getByTestId('sidebar-title')
    await expect(sidebarTitle).toBeVisible()
  })
})
