import type { Page, Locator } from '@playwright/test'
import { sectionsConfig, type SectionType } from '@config/sections'

export class ContentListPage {
  readonly page: Page
  constructor(page: Page) {
    this.page = page
  }

  async goto(locale: 'es' | 'en', collection: string) {
    await this.page.goto(`/${locale}/${collection}`)
  }

  headerTitle(): Locator {
    return this.page.getByTestId('header-title')
  }

  tagLink(tag: string): Locator {
    return this.page.getByTestId(`tag-link-${tag}`)
  }

  async openItem(locale: 'es' | 'en', section: SectionType, itemPath: string) {
    const route = sectionsConfig[section].routes[locale]
    const href = `/${locale}/${route}/${itemPath}`
    const pattern = `${locale}/${route}/`
    await Promise.all([
      this.page.waitForURL(new RegExp(pattern)),
      this.page.locator(`[href="${href}"]`).click()
    ])
  }
}
