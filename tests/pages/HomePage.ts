import type { Page, Locator } from '@playwright/test'

export class HomePage {
  readonly page: Page
  constructor(page: Page) {
    this.page = page
  }

  async goto(locale: string) {
    await this.page.goto(`/${locale}/`)
  }

  headerTitle(): Locator {
    return this.page.locator('[data-testid="header-title"]')
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
  blogHighlight(): Locator {
    return this.page.locator('[data-testid="highlight-blog"]')
  }

  talkHighlight(): Locator {
    return this.page.locator('[data-testid="highlight-talk"]')
  }
}
