import type { Page, Locator } from '@playwright/test'

export class SidebarPage {
  readonly page: Page
  constructor(page: Page) {
    this.page = page
  }

  hamburger(): Locator {
    return this.page.getByTestId('hamburger')
  }

  sidebarTitle(): Locator {
    return this.page.getByTestId('sidebar-title')
  }

  themeToggle(): Locator {
    return this.page.getByTestId('theme-toggle')
  }
}
