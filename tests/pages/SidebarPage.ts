import { step } from '@tests/fixtures'
import { sidebarToggleFromPage, SidebarToggle } from '@tests/pages/SidebarToggle'
import { target } from '@tests/pages/Target'
import type { Target as TargetComponent } from '@tests/pages/Target'
import { ThemeToggle, themeToggleFromPage } from '@tests/pages/ThemeToggle'

export class SidebarPage {
  constructor(
    readonly toggle: SidebarToggle,
    readonly sidebarTitle: TargetComponent,
    readonly themeToggle: ThemeToggle,
    readonly aboutLink: TargetComponent,
  ) {}

  shouldHaveHamburgerButton() {
    return this.toggle.shouldHaveHamburgerButton()
  }

  toggleSidebar() {
    return this.toggle.toggle()
  }

  shouldHaveSidebarOpen() {
    return this.toggle.shouldBeOpen()
  }

  shouldHaveSidebarClosed() {
    return this.toggle.shouldBeClosed()
  }

  shouldHaveHamburgerOpenState() {
    return this.toggle.hamburgerShouldHaveOpenState()
  }

  shouldHaveHamburgerClosedState() {
    return this.toggle.hamburgerShouldHaveClosedState()
  }

  shouldShowNavigationLinks() {
    return this.toggle.showNavigationLinks()
  }

  shouldBeReady() {
    return step('sidebar should be ready', async ({ expect }) => {
      await expect(this.sidebarTitle.locator).toBeVisible()
      await expect(this.toggle.hamburger.locator).toBeVisible()
    })
  }

  shouldHaveAboutLink(i18n: Record<string, string>) {
    return step('sidebar shows about link text', async ({ expect }) => {
      await expect(this.aboutLink.locator).toBeVisible()
      await expect(this.aboutLink.locator).toHaveText(i18n['nav.about'])
    })
  }

  shouldHaveThemeToggle() {
    return this.themeToggle.shouldBeVisible()
  }

  toggleTheme() {
    return this.themeToggle.toggleTheme()
  }

  getTransformOfThemeToggle() {
    return this.themeToggle.getTransform()
  }

  themeToggleShouldBeDifferent(initialTransform: string) {
    return this.themeToggle.shouldBeDifferent(initialTransform)
  }
}

export function sidebarPage(page: import('@playwright/test').Page) {
  return new SidebarPage(
    sidebarToggleFromPage(page),
    target(page.getByTestId('sidebar-title')),
    themeToggleFromPage(page),
    target(page.getByTestId('sidebar-about')),
  )
}
