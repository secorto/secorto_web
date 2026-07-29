import { test } from '@tests/fixtures'
import { SidebarPage } from '@tests/support/ui/sidebar/SidebarPage'
import { userInHome } from '@tests/support/ui/home/pages/HomePage'

test.describe('Hamburger menu', { tag: ['@functional', '@home', '@menu', '@sidebar', '@es'] }, () => {
  test.use({ viewport: { width: 375, height: 667 } })

  let userInMenuFlow: () => Promise<SidebarPage>

  test.beforeEach(async ({ page }) => {
    userInMenuFlow = async () => {
      const homePage = await userInHome(page, 'es')
      return homePage.mainLayout.sidebar
    }
  })

  test('hamburger button is visible on mobile', async () => {
    const menu = await userInMenuFlow()
    await menu.shouldHaveHamburgerButton()
  })

  test('clicking hamburger opens sidebar', async () => {
    const menu = await userInMenuFlow()
    await menu.shouldHaveSidebarClosed()
    await menu.toggleSidebar()
    await menu.shouldHaveSidebarOpen()
  })

  test('clicking hamburger again closes sidebar', async () => {
    const menu = await userInMenuFlow()
    await menu.toggleSidebar()
    await menu.shouldHaveSidebarOpen()
    await menu.toggleSidebar()
    await menu.shouldHaveSidebarClosed()
  })

  test('hamburger button toggles its own sidebar-open class', async () => {
    const menu = await userInMenuFlow()
    await menu.shouldHaveHamburgerClosedState()
    await menu.toggleSidebar()
    await menu.shouldHaveHamburgerOpenState()
    await menu.toggleSidebar()
    await menu.shouldHaveHamburgerClosedState()
  })

  test('sidebar contains navigation links', async () => {
    const menu = await userInMenuFlow()
    await menu.toggleSidebar()
    await menu.shouldHaveSidebarOpen()
    await menu.shouldShowNavigationLinks()
  })
})
