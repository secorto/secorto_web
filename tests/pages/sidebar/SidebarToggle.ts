import { step } from '@tests/fixtures'
import { target } from '@tests/pages/components/Target'
import type { Target as TargetComponent } from '@tests/pages/components/Target'
import type { Page } from '@playwright/test'

export class SidebarToggle {
  constructor(readonly hamburger: TargetComponent, readonly sidebar: TargetComponent) {}

  shouldHaveHamburgerButton() {
    return this.hamburger.shouldBeVisible()
  }

  toggle() {
    return this.hamburger.click()
  }

  shouldBeOpen() {
    return this.sidebar.shouldHaveClass(/sidebar-open/)
  }

  shouldBeClosed() {
    return step('sidebar should be closed', async ({ expect }) => {
      await expect(this.sidebar.locator).not.toHaveClass(/sidebar-open/)
    })
  }

  hamburgerShouldHaveOpenState() {
    return this.hamburger.shouldHaveClass(/sidebar-open/)
  }

  hamburgerShouldHaveClosedState() {
    return step('hamburger should not have open state class', async ({ expect }) => {
      await expect(this.hamburger.locator).not.toHaveClass(/sidebar-open/)
    })
  }

  showNavigationLinks() {
    return step('sidebar shows navigation links', async ({ expect }) => {
      await expect(this.sidebar.locator.locator('[data-testid="sidebar-title"]')).toBeVisible()
    })
  }
}

export function sidebarToggle(hamburgerLocator: import('@playwright/test').Locator, sidebarLocator: import('@playwright/test').Locator) {
  return new SidebarToggle(
    target('sidebar hamburger', hamburgerLocator),
    target('sidebar panel', sidebarLocator),
  )
}

export function sidebarToggleFromPage(page: Page) {
  return sidebarToggle(page.getByTestId('hamburger'), page.locator('.sidebar-toggle'))
}
