import { test } from '@tests/fixtures'
import { userInHome } from '@tests/support/ui/home/pages/HomePage'

test.describe('Mobile sidebar toggle', { tag: ['@functional', '@home', '@sidebar', '@mobile'] }, () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('hamburger menu interaction flow', async ({page}) => {
    const homePage = await userInHome(page, 'es')

    const menu = homePage.mainLayout.sidebar
    await menu.toggle.shouldBeClosed()

    await menu.toggleSidebar()
    await menu.toggle.shouldBeOpen()
    await menu.sidebarTitle.shouldBeVisible()

    await menu.toggleSidebar()
    await menu.toggle.shouldBeClosed()
  })
})

test.describe('Desktop sidebar toggle', { tag: ['@functional', '@home', '@sidebar', '@desktop'] }, () => {
  test.use({ viewport: { width: 1280, height: 720 } })

  test('sidebar is always open on desktop', async ({page}) => {
    const homePage = await userInHome(page, 'es')
    const menu = homePage.mainLayout.sidebar
    await menu.toggle.shouldBePermanentlyOpen()
    await menu.sidebarTitle.shouldBeVisible()
  })
})
