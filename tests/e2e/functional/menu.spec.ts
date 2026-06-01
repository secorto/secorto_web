import { test } from '@tests/fixtures'
import type { GherkinStepDefinition } from '@tests/fixtures'
import { userInHome } from '@tests/pages/home/MenuUserJourney'
import type { MenuUserJourney } from '@tests/pages/home/MenuUserJourney'

test.describe('Hamburger menu', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  let userInMenuFlow: () => GherkinStepDefinition<MenuUserJourney>

  test.beforeEach(async ({ page }) => {
    userInMenuFlow = () => userInHome(page, 'es')
  })

  test('hamburger button is visible on mobile', async ({ Given, Then }) => {
    const menu = await Given(userInMenuFlow())
    await Then(menu.shouldHaveHamburgerButton())
  })

  test('clicking hamburger opens sidebar', async ({ Given, When, Then, And }) => {
    const menu = await Given(userInMenuFlow())
    await And(menu.shouldHaveSidebarClosed())
    await When(menu.toggleSidebar())
    await Then(menu.shouldHaveSidebarOpen())
  })

  test('clicking hamburger again closes sidebar', async ({ Given, When, Then, And }) => {
    const menu = await Given(userInMenuFlow())
    await When(menu.toggleSidebar())
    await And(menu.shouldHaveSidebarOpen())
    await When(menu.toggleSidebar())
    await Then(menu.shouldHaveSidebarClosed())
  })

  test('hamburger button toggles its own sidebar-open class', async ({ Given, When, Then, And }) => {
    const menu = await Given(userInMenuFlow())
    await Then(menu.shouldHaveHamburgerClosedState())
    await When(menu.toggleSidebar())
    await And(menu.shouldHaveHamburgerOpenState())
    await When(menu.toggleSidebar())
    await Then(menu.shouldHaveHamburgerClosedState())
  })

  test('sidebar contains navigation links', async ({ Given, When, Then, And }) => {
    const menu = await Given(userInMenuFlow())
    await When(menu.toggleSidebar())
    await And(menu.shouldHaveSidebarOpen())
    await Then(menu.shouldShowNavigationLinks())
  })
})
