import { test, expect } from '@playwright/test'
import { ContentListPage } from '../pages/ContentListPage'

test.describe('Charlas', () => {
  test('Permite navegar por categorías y ver una charla', async ({ page }) => {
    const list = new ContentListPage(page)
    await list.goto('es', 'charla')

    // Verifica título y encabezado principal
    await expect(page).toHaveTitle('Charlas | SeCOrTo')
    await expect(list.headerTitle()).toHaveText('Charlas')

    // Interactúa con la categoría "containers"
    const containersTag = list.tagLink('containers')
    await expect(containersTag).not.toHaveClass(/active/)
    await containersTag.click()
    await expect(containersTag).toHaveClass(/active/)
    await expect(list.headerTitle()).toHaveText('Charlas - containers')

    // Accede a la charla de Devcontainers
    await list.openItem('es', 'talk', '2023-09-27-devcontainers')
    await expect(page.locator('header h1')).toHaveText('Devcontainers en localhost')
  })
})
