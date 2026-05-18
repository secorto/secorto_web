import type { Page, Locator } from '@playwright/test'

export class BlogPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  headerTitle(): Locator {
    return this.page.getByTestId('header-title')
  }

  tagLink(tag: string): Locator {
    return this.page.getByTestId(`tag-link-${tag}`)
  }
}
