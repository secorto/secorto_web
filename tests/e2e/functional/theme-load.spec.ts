import { test, expect } from '@playwright/test'

test.use({ colorScheme: 'dark' })

test('Carga en dark', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveClass(/dark/)
})
