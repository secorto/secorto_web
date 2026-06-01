import type { Locator, Page } from '@playwright/test'

export class FooterPage {
  constructor(readonly page: Page) {}

  avatar(): Locator {
    return this.page.getByTestId('footer-avatar')
  }

  role(): Locator {
    return this.page.getByTestId('footer-role')
  }

  follow(): Locator {
    return this.page.getByTestId('footer-follow')
  }
}
