import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { step } from '@tests/fixtures'
import { target } from '@tests/support/ui/components/Target'
import type { Target as TargetComponent } from '@tests/support/ui/components/Target'
import { ContentPage, createContentPage } from '@tests/support/ui/content/ContentPage'

/**
 * Page Object for content detail views (blog post, talk detail, work detail, etc.).
 * Handles detail-specific interactions and assertions.
 */
export class ContentDetailPage extends ContentPage {
  constructor(
    name: string,
    headerTitle: TargetComponent,
    tags: TargetComponent,
    readonly postRole?: TargetComponent,
    readonly postResponsibilities?: TargetComponent,
    readonly postWebsite?: TargetComponent,
  ) {
    super(name, headerTitle, tags, null)
  }

  shouldHaveDetailTitle(expected: string) {
    return this.headerTitle.shouldHaveText(expected)
  }

  shouldHaveTags(ariaSnapshot: string) {
    return step(`${this.name} detail has expected tags`, async ({ expect }) => {
      await expect(this.tags.locator).toMatchAriaSnapshot(ariaSnapshot)
    })
  }

  shouldHaveComments(locale: UILanguages) {
    if (!this.comments) {
      throw new Error(`${this.name} detail page does not have comments`)
    }
    return this.comments.shouldBeReady(locale)
  }

  shouldHaveRole(expected: string) {
    if (!this.postRole) {
      throw new Error(`${this.name} detail page does not have role field`)
    }
    return this.postRole.shouldHaveText(expected)
  }

  shouldHaveResponsibilities(expected: string) {
    if (!this.postResponsibilities) {
      throw new Error(`${this.name} detail page does not have responsibilities field`)
    }
    return this.postResponsibilities.shouldHaveText(expected)
  }

  shouldHaveWebsite(expected: string) {
    if (!this.postWebsite) {
      throw new Error(`${this.name} detail page does not have website field`)
    }
    return this.postWebsite.shouldHaveAttribute('href', expected)
  }
}

/**
 * Factory for creating ContentDetailPage with all detail-specific elements.
 * Used for content types with full detail metadata (blog, talk, work).
 */
export function contentDetailPage(page: Page, name: string): ContentDetailPage {
  const basePage = createContentPage(page, name)
  return new ContentDetailPage(
    basePage.name,
    basePage.headerTitle,
    basePage.tags,
    target(`${name} role`, page.getByTestId('post-role')),
    target(`${name} responsibilities`, page.getByTestId('post-responsibilities')),
    target(`${name} website`, page.getByTestId('post-website')),
  )
}

/**
 * Factory for creating ContentDetailPage without optional detail fields.
 * Used for simpler content types or when fields are not applicable.
 */
export function contentDetailPageMinimal(page: Page, name: string): ContentDetailPage {
  const basePage = createContentPage(page, name)
  return new ContentDetailPage(
    basePage.name,
    basePage.headerTitle,
    basePage.tags,
  )
}
