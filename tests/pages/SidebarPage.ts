import type { Page, Locator } from '@playwright/test'

export class SidebarPage {
  readonly page: Page
  constructor(page: Page) {
    this.page = page
  }

  sidebarLink(routeKey: string): Locator {
    return this.page.getByTestId(`sidebar-${routeKey}`)
  }

  async gotoLocale(locale: 'es' | 'en') {
    await this.page.goto(`/${locale}`)
  }

  async clickSidebarLink(routeKey: string) {
    await this.sidebarLink(routeKey).click()
  }

  getHamburger(): Locator {
    return this.page.getByTestId('hamburger')
  }

  getSidebarTitle(): Locator {
    return this.page.getByTestId('sidebar-title')
  }

  getThemeToggle(): Locator {
    return this.page.getByTestId('theme-toggle')
  }

  async toggleTheme() {
    await this.getThemeToggle().click()
  }
}
