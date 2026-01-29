import type { Page, Locator } from '@playwright/test'

export class BlogPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async gotoList(path: string) {
    await this.page.goto(path)
  }

  headerTitle(): Locator {
    return this.page.getByTestId('header-title')
  }

  tagLink(tag: string): Locator {
    return this.page.getByTestId(`tag-link-${tag}`)
  }

  async openPost(href: string, locale: string) {
    await Promise.all([
      this.page.waitForURL(new RegExp(`${locale}/blog/`)),
      this.page.locator(`[href="${href}"]`).click()
    ])
  }
}
