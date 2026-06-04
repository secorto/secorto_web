import { step } from '@tests/fixtures'
import { sidebarToggleFromPage, SidebarToggle } from '@tests/pages/sidebar/SidebarToggle'
import { target } from '@tests/pages/components/Target'
import type { Target as TargetComponent } from '@tests/pages/components/Target'
import { ThemeToggle, themeToggleFromPage } from '@tests/pages/sidebar/ThemeToggle'
import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { visit } from '../shared/UserJourneyFactory'

export class SidebarPage {
  constructor(
    readonly toggle: SidebarToggle,
    readonly sidebarTitle: TargetComponent,
    readonly themeToggle: ThemeToggle,
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

  shouldHaveLogo() {
    return this.logo.shouldHaveCount(1)
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

export function sidebarPage(page: Page) {
  return new SidebarPage(
    sidebarToggleFromPage(page),
    target('sidebar title', page.getByTestId('sidebar-title')),
    themeToggleFromPage(page),
    target('sidebar about link', page.getByTestId('sidebar-about')),
    target('sidebar logo', page.locator('nav.sidebar svg.sidebar-logo')),
  )
}

export const userInHome = (page: Page, locale: UILanguages) =>
  visit(`a user opening home in ${locale} for menu flow`, page, locale, sidebarPage)
