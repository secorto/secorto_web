import { test, expect } from '@tests/fixtures'
import { userInHome } from '@tests/pages/home/HomeUserJourney'
import { ui } from '@i18n/ui'

test('smoke: homepage (es) carga y sidebar muestra logo/imagen', async ({ Given, Then, And, page }) => {
  const home = await Given(userInHome(page, 'es'))

  // Basic i18n and sidebar readiness via user journey
  await Then(home.sidebar.shouldBeReady())
  await Then(home.shouldHaveAboutLink(ui['es']))

  // Deterministic checks based on build output
  const lang = await page.getAttribute('html', 'lang')
  expect(lang, 'HTML lang attribute').toBe('es')

  await expect(page.locator('nav.sidebar svg.sidebar-logo'), 'Sidebar logo').toHaveCount(1)
})
