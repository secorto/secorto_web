import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { step } from '@tests/fixtures'
import { visit } from './UserJourneyFactory'
import { BlogPage } from './BlogPage'
import type { TestInfo } from '@playwright/test'
import { pageHelper } from './Page'
import { contentListPath, contentDetailsPath } from '@tests/pages/NavigationPaths'
import { contentListPage } from '@tests/pages/ContentListPage'
import { ContentListJourney, ContentDetailJourney } from '@tests/pages/ContentUserJourney'

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

export class BlogListJourney extends ContentListJourney {
  constructor(page: Page, locale: UILanguages) {
    super(page, contentListPage(page), locale, 'nav.blog')
  }

  clickItem(slug: string) {
    const href = contentDetailsPath('blog', this.locale, slug)
    return this.list.clickItemAndReturn(href, `click blog item "${slug}"`, () => {
      return new BlogDetailJourney(this.page, this.list, this.locale)
    })
  }
}

export class BlogDetailJourney extends ContentDetailJourney {}

export const userInBlogList = (page: Page, locale: UILanguages) =>
  visit(
    `a user in blog list ${locale}`,
    page,
    contentListPath('blog', locale),
    (p) => new BlogListJourney(p, locale),
  )

export const userInBlogPost = (
  page: Page,
  locale: UILanguages,
  slug: string,
  viewport?: { width: number; height: number },
) =>
  visit(
    `a user opening blog post ${slug} in ${locale}`,
    page,
    contentDetailsPath('blog', locale, slug),
    () => new BlogUserJourney(page, new BlogPage(page)),
    async (p) => {
      if (viewport) await p.setViewportSize(viewport)
    },
  )
