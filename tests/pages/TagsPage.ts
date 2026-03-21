import type { Page, Locator } from '@playwright/test'

export class TagsPage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  pageTitle(): Locator {
    return this.page.getByTestId('header-title')
  }

  pageDescription(): Locator {
    return this.page.getByTestId('tags-description')
  }

  tagGroups(): Locator {
    return this.page.getByTestId('global-tag-groups')
  }

  allTagGroups(): Locator {
    return this.page.getByTestId(/^global-tag-/)
  }

  firstTagGroup(): Locator {
    return this.allTagGroups().first()
  }

  firstTagLink(): Locator {
    return this.tagGroups().locator('a').first()
  }

  getPageBodyText(): Promise<string | null> {
    return this.page.textContent('body')
  }
}
