import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { comments } from '@tests/support/ui/content/Comments'
import type { Comments as CommentsComponent } from '@tests/support/ui/content/Comments'
import { ContentPage, createContentPage } from './ContentPage'
import type { Target as TargetComponent } from '@tests/support/ui/components/Target'

/**
 * Page Object for content detail views with comments (blog post, talk detail).
 * Specialization of ContentPage that provides comment interactions and assertions.
 */
export class ContentPostDetailPage extends ContentPage {
  constructor(
    name: string,
    headerTitle: TargetComponent,
    tags: TargetComponent,
    readonly comments: CommentsComponent,
  ) {
    super(name, headerTitle, tags)
  }

  shouldHaveComments(locale: UILanguages) {
    return this.comments.shouldBeReady(locale)
  }
}

/**
 * Factory for creating ContentPostDetailPage with comment support.
 * Used for content types with comments (blog, talk).
 */
export function contentPostDetailPage(page: Page, name: string): ContentPostDetailPage {
  const basePage = createContentPage(page, name)
  return new ContentPostDetailPage(
    basePage.name,
    basePage.headerTitle,
    basePage.tags,
    comments(
      page.locator('.comments script[src*="giscus.app"]'),
      page.locator('iframe.giscus-frame'),
    ),
  )
}
