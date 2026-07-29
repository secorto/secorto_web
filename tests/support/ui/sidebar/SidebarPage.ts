import { verifyStep } from '@tests/fixtures'
import { sidebarToggleFromPage, SidebarToggle } from '@tests/support/ui/sidebar/SidebarToggle'
import { target } from '@tests/support/ui/components/Target'
import type { Target as TargetComponent } from '@tests/support/ui/components/Target'
import type { Page } from '@playwright/test'
import type { LocalizedPage } from '@tests/support/ui/shared/contracts/localization'
import { ui, type UILanguages } from '@i18n/ui'

export class SidebarPage implements LocalizedPage<void> {
  constructor(
    readonly toggle: SidebarToggle,
    readonly sidebarTitle: TargetComponent,
    readonly aboutLink: TargetComponent,
    readonly logo: TargetComponent,
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
    return verifyStep('sidebar should be ready', async ({ expect }) => {
      await expect(this.sidebarTitle.locator).toBeVisible()
      await expect(this.toggle.hamburger.locator).toBeVisible()
    })
  }

  shouldBeLoaded(locale: UILanguages) {
    return verifyStep('sidebar is loaded correctly', async ({ expect }) => {
      await expect(this.sidebarTitle.locator).toBeVisible()
      await expect(this.aboutLink.locator).toHaveText(ui[locale]['nav.about'])
      await this.logo.shouldHaveCount(1).with(expect)
    })
  }
}

export function sidebarPage(page: Page) {
  return new SidebarPage(
    sidebarToggleFromPage(page),
    target('sidebar title', page.getByTestId('sidebar-title')),
    target('sidebar about link', page.getByTestId('sidebar-about')),
    target('sidebar logo', page.locator('nav.sidebar svg.sidebar-logo')),
  )
}
