import type { Page, Locator } from '@playwright/test'
import { sectionsConfig, type SectionType } from '@config/sections'
import type { UILanguages } from '@i18n/ui'

export class ContentListPage {
  readonly page: Page
  constructor(page: Page) {
    this.page = page
  }

  async goto(locale: UILanguages, collection: SectionType) {
    const route = sectionsConfig[collection].routes[locale]
    await this.page.goto(`/${locale}/${route}`)
  }

  headerTitle(): Locator {
    return this.page.getByTestId('header-title')
  }

  tagLink(tag: string): Locator {
    return this.page.getByTestId(`tag-link-${tag}`)
  }

  async openItem(locale: UILanguages, collection: SectionType, itemPath: string) {
    const route = sectionsConfig[collection].routes[locale]
    const href = `/${locale}/${route}/${itemPath}`
    const pattern = `${locale}/${route}/`
    await Promise.all([
      this.page.waitForURL(new RegExp(pattern)),
      this.page.locator(`[href="${href}"]`).click()
    ])
  }
}
