import { test } from '@tests/fixtures'
import { userInHome } from '@tests/pages/home/HomeUserJourney'

test('smoke: sidebar muestra logo', async ({ Given, Then, page }) => {
  const home = await Given(userInHome(page, 'es'))
  await Then(home.sidebar.shouldHaveLogo())
})
