import type { Page } from '@playwright/test'
import { verifyStep, step } from '@tests/fixtures'
import { targetSelector } from '@tests/support/ui/components/Target'
import type { Target as TargetComponent } from '@tests/support/ui/components/Target'
import type { TargetSelector } from '@tests/support/ui/components/Target'
import { ContentPage, createContentPage } from './ContentPage'

/**
 * Page Object for content tag filter views (blog tagged, work tagged, etc.).
 * Handles tag-specific interactions and displays filtered content by tags.
 */
export class ContentTagsPage extends ContentPage {
  constructor(
    name: string,
    headerTitle: TargetComponent,
    tags: TargetComponent,
    readonly tagLinks: TargetSelector<string>,
    readonly itemLinks: TargetSelector<string>,
  ) {
    super(name, headerTitle, tags)
  }

  /**
   * Verify the tags page title includes both section name and filter tag.
   * @param expectedSectionTitle - The section name (e.g., "Blog")
   * @param tag - The tag name being displayed
   */
  shouldHaveFilteredTitle(expectedSectionTitle: string, tag: string) {
    return this.headerTitle.shouldHaveText(`${expectedSectionTitle} - ${tag}`)
  }

  /**
   * Click on a tagged item to navigate to its detail view.
   * @param href - The item's URL path
   * @param title - Display name for the step
   */
  clickItem(href: string, title: string) {
    return step(title, async () => {
      await this.itemLinks.get(href).locator.click()
    })
  }

  /**
   * Assert that all available tags for the section are rendered.
   */
  shouldRenderTagsForSection() {
    return verifyStep(`${this.name} tags renders available tags`, async ({ expect }) => {
      await expect(this.tags.locator).toBeVisible()

      const tagLinks = this.tags.locator.locator('[data-testid^="tag-link-"]')
      await expect
        .poll(async () => tagLinks.count())
        .toBeGreaterThan(0)
    })
  }
}

/**
 * Factory for creating ContentTagsPage.
 * Used when filtering content by tags within a section.
 */
export function contentTagsPage(page: Page, name: string): ContentTagsPage {
  const basePage = createContentPage(page, name)
  return new ContentTagsPage(
    basePage.name,
    basePage.headerTitle,
    basePage.tags,
    targetSelector(`${name} tag link`, (tag: string) => page.getByTestId(`tag-link-${tag}`)),
    targetSelector(`${name} item link`, (href: string) => page.locator(`[href="${href}"]`)),
  )
}
