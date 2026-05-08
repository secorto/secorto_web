import type { Page, Locator } from '@playwright/test'

export class HomePage {
  readonly page: Page
  constructor(page: Page) {
    this.page = page
  }

  async goto(locale: string) {
    await this.page.goto(`/${locale}/`)
  }

  avatar(): Locator {
    return this.page.locator('.home-avatar svg')
  }

  bioText(): Locator {
    return this.page.locator('.home-bio-text')
  }

  pybaq(): Locator {
    return this.page.locator('.pybaq-callout')
  }

  highlights(): Locator {
    return this.page.locator('[data-testid^="highlight-"]')
  }

  firstHighlight(): Locator {
    return this.page.locator('[data-testid="highlight-0"]')
  }
}
