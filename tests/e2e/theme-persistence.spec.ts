import { test, expect } from '@playwright/test'
import { SidebarPage } from '@tests/pages/SidebarPage'

test('Persistencia de tema en localStorage', async ({ page }) => {
  const sidebar = new SidebarPage(page)
  await page.goto('/')

  // Asegurarse estado inicial
  const before = await page.evaluate(() => localStorage.getItem('theme'))

  // Toggle y comprobar localStorage
  await sidebar.getThemeToggle().click()
  const theme = await page.evaluate(() => localStorage.getItem('theme'))
  expect(theme).toBeTruthy()

  // Recargar y verificar que la clase en <html> corresponde al valor guardado
  await page.reload()
  await expect(page.locator('html')).toHaveClass(theme === 'dark' ? /dark/ : /light/)

  // Restaurar estado original si existía
  if (before === null) {
    // volver al valor por defecto
    await sidebar.getThemeToggle().click()
  } else if (before !== theme) {
    // restaurar valor previo
    if ((await page.evaluate(() => localStorage.getItem('theme'))) !== before) {
      await sidebar.getThemeToggle().click()
    }
  }
})
