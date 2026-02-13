import { test, expect } from '@playwright/test'

test('switch from Spanish to English via UI', async ({ page }) => {
  await page.goto('/es/')
  const en = page.getByTestId('lang-en')
  await expect(en).toBeVisible()
  await en.click()
  await expect(page).toHaveURL(/\/en(\/|$)/)
})

test('switch from English to Spanish via UI', async ({ page }) => {
  await page.goto('/en/')
  const es = page.getByTestId('lang-es')
  await expect(es).toBeVisible()
  await es.click()
  await expect(page).toHaveURL(/\/es(\/|$)/)
})

