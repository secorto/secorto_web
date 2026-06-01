import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { step } from '@tests/fixtures'
import { visit } from './UserJourneyFactory'
import { BlogPage } from './BlogPage'
import type { TestInfo } from '@playwright/test'
import { pageHelper } from './Page'

export class BlogUserJourney {
  constructor(readonly page: Page, readonly blog: BlogPage) {}

  shouldHaveTitle(expected: string) {
    return step('shows post title', async ({ expect }) => {
      await expect(this.blog.headerTitle()).toHaveText(expected)
    })
  }

  assertNoHorizontalOverflow(testInfo?: TestInfo, locale?: string) {
    return pageHelper(this.page).assertNoHorizontalOverflow(testInfo, locale)
  }
}

export const userInBlogPost = (
  page: Page,
  locale: UILanguages,
  slug: string,
  viewport?: { width: number; height: number },
) =>
  visit(
    `a user opening blog post ${slug} in ${locale}`,
    page,
    `/${locale}/blog/${slug}`,
    () => new BlogUserJourney(page, new BlogPage(page)),
    async (p) => {
      if (viewport) await p.setViewportSize(viewport)
    },
  )
