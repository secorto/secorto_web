import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Página de inicio | SeCOrTo/);
});

test('Blog', async ({ page }) => {
  await page.goto('');

  await page.getByRole('link', { name: 'Blog' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Blog' })).toBeVisible();
});
