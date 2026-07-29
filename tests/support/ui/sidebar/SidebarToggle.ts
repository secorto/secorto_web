import { verifyStep } from '@tests/fixtures'
import type { Locator, Page } from '@playwright/test'

export class SidebarToggle {
  constructor(readonly hamburger: Locator, readonly sidebar: Locator) {}

  shouldHaveHamburgerButton() {
    return verifyStep('hamburger button should be visible', async ({ expect }) => {
      await expect(this.hamburger).toBeVisible()
    })
  }

  toggle() {
    return this.hamburger.click()
  }

  shouldBeOpen() {
    return verifyStep('sidebar should be open', async ({ expect }) => {
      await expect(this.hamburger).toBeVisible()
      await expect(this.sidebar).toHaveClass(/sidebar-open/)
      await expect(this.hamburger).toHaveClass(/sidebar-open/)
    })
  }

  shouldBeClosed() {
    return verifyStep('sidebar should be closed', async ({ expect }) => {
      await expect(this.hamburger).toBeVisible()
      await expect(this.sidebar).not.toHaveClass(/sidebar-open/)
      await expect(this.hamburger).not.toHaveClass(/sidebar-open/)
    })
  }

  shouldBePermanentlyOpen() {
    return verifyStep('sidebar should be permanently open', async ({ expect }) => {
      await expect(this.sidebar).toBeVisible()
      await expect(this.hamburger).not.toBeVisible()
    })
  }
}

export function sidebarToggle(hamburgerLocator: Locator, sidebarLocator: Locator) {
  return new SidebarToggle(
    hamburgerLocator,
    sidebarLocator,
  )
}

export function sidebarToggleFromPage(page: Page) {
  return sidebarToggle(page.getByTestId('hamburger'), page.locator('.sidebar-toggle'))
}
