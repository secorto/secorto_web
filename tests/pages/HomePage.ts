import type { Page, Locator } from '@playwright/test'

export class HomePage {
  readonly page: Page
  constructor(page: Page) {
    this.page = page
  }

  headerTitle(): Locator {
    return this.page.getByTestId('header-title')
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
    return this.page.getByTestId('highlight-blog')
  }

  talkHighlight(): Locator {
    return this.page.getByTestId('highlight-talk')
  }
}
