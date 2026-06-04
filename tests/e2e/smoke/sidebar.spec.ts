import { test } from '@tests/fixtures'
import { userInHome } from '@tests/pages/home/HomeUserJourney'

test('smoke: sidebar muestra logo', { tag: ['@smoke', '@home', '@sidebar', '@es'] }, async ({ page }) => {
  const home = await userInHome(page, 'es')
  await home.sidebar.shouldHaveLogo()
})
