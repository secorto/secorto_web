import type { Page, Locator } from '@playwright/test'

export class ContentListPage {
  readonly page: Page
  constructor(page: Page) {
    this.page = page
  }

  headerTitle(): Locator {
    return this.page.getByTestId('header-title')
  }

  tags(): Locator {
    return this.page.getByTestId('tags')
  }

  tagLink(tag: string): Locator {
    return this.page.getByTestId(`tag-link-${tag}`)
  }

  itemLink(href: string): Locator {
    return this.page.locator(`[href="${href}"]`)
  }

  commentsScript(): Locator {
    return this.page.locator('.comments script[src*="giscus.app"]')
  }

  commentsFrame(): Locator {
    return this.page.locator('iframe.giscus-frame')
  }

  postRole(): Locator {
    return this.page.getByTestId('post-role')
  }

  postResponsibilities(): Locator {
    return this.page.getByTestId('post-responsibilities')
  }

  postWebsite(): Locator {
    return this.page.getByTestId('post-website')
  }
}
