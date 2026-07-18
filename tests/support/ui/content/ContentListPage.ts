import type { Page } from '@playwright/test'
import { step } from '@tests/fixtures'
import { targetSelector } from '@tests/support/ui/components/Target'
import type { Target as TargetComponent } from '@tests/support/ui/components/Target'
import type { TargetSelector } from '@tests/support/ui/components/Target'
import { ContentPage, createContentPage } from '@tests/support/ui/content/ContentPage'

/**
 * Page Object for content list views (blog list, work list, etc.).
 * Handles list-specific interactions like filtering and navigation.
 */
export class ContentListPage extends ContentPage {
  constructor(
    name: string,
    headerTitle: TargetComponent,
    tags: TargetComponent,
    readonly tagLinks: TargetSelector<string>,
    readonly itemLinks: TargetSelector<string>,
  ) {
    super(name, headerTitle, tags)
  }

  shouldHaveFilteredTitle(expectedSectionTitle: string, tag: string) {
    return this.headerTitle.shouldHaveText(`${expectedSectionTitle} - ${tag}`)
  }

  filterByTag(tag: string) {
    return step(`filter ${this.name} list by tag "${tag}"`, async ({ expect }) => {
      const tagLink = this.tagLinks.get(tag)
      await expect(tagLink.locator).not.toHaveClass(/active/)
      await tagLink.locator.click()
      await expect(tagLink.locator).toHaveClass(/active/)
    })
  }

  clickItem(href: string, title: string) {
    return step(title, async () => {
      await this.itemLinks.get(href).locator.click()
    })
  }

  shouldRenderTagsForSection() {
    return step(`${this.name} list renders available tags`, async ({ expect }) => {
      await expect(this.tags.locator).toBeVisible()

      const tagLinks = this.tags.locator.locator('[data-testid^="tag-link-"]')
      await expect
        .poll(async () => tagLinks.count())
        .toBeGreaterThan(0)
    })
  }
}

export function contentListPage(page: Page, name: string): ContentListPage {
  const basePage = createContentPage(page, name)
  return new ContentListPage(
    basePage.name,
    basePage.headerTitle,
    basePage.tags,
    targetSelector(`${name} tag link`, (tag: string) => page.getByTestId(`tag-link-${tag}`)),
    targetSelector(`${name} item link`, (href: string) => page.locator(`[href="${href}"]`)),
  )
}
