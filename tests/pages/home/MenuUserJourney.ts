import type { UILanguages } from '@i18n/ui'
import type { Page } from '@playwright/test'
import { sidebarPage } from '@tests/pages/sidebar/SidebarPage'
import type { SidebarPage } from '@tests/pages/sidebar/SidebarPage'
import { userInHomeFactory } from '@tests/pages/shared/UserJourneyFactory'

export class MenuUserJourney {
  constructor(readonly sidebar: SidebarPage) {}

  shouldHaveHamburgerButton() {
    return this.sidebar.shouldHaveHamburgerButton()
  }

  shouldHaveSidebarClosed() {
    return this.sidebar.shouldHaveSidebarClosed()
  }

  toggleSidebar() {
    return this.sidebar.toggleSidebar()
  }

  shouldHaveSidebarOpen() {
    return this.sidebar.shouldHaveSidebarOpen()
  }

  shouldHaveHamburgerOpenState() {
    return this.sidebar.shouldHaveHamburgerOpenState()
  }

  shouldHaveHamburgerClosedState() {
    return this.sidebar.shouldHaveHamburgerClosedState()
  }

  shouldShowNavigationLinks() {
    return this.sidebar.shouldShowNavigationLinks()
  }
}

const menuJourney = (page: Page) => new MenuUserJourney(sidebarPage(page))

export const userInHome = (page: Page, locale: UILanguages) =>
  userInHomeFactory(`a user opening home in ${locale} for menu flow`, page, locale, menuJourney)
