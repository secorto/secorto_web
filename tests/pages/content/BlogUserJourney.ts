import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { visit } from '@tests/pages/shared/UserJourneyFactory'
import { ContentListPage, contentListPage } from '@tests/pages/content/ContentListPage'
import type { TestInfo } from '@playwright/test'
import { pageHelper } from '@tests/pages/components/PageHelper'
import { contentListPath, contentDetailsPath } from '@tests/pages/shared/NavigationPaths'
import { ContentListJourney, ContentDetailJourney } from '@tests/pages/content/ContentUserJourney'

export class BlogUserJourney {
  constructor(readonly page: Page, readonly list: ContentListPage) {}

  shouldHaveTitle(expected: string) {
    return this.list.shouldHaveDetailTitle(expected)
  }

  assertNoHorizontalOverflow(testInfo?: TestInfo, locale?: string) {
    return pageHelper(this.page).assertNoHorizontalOverflow(testInfo, locale)
  }
}

export class BlogListJourney extends ContentListJourney {
  constructor(page: Page, locale: UILanguages) {
    super(page, contentListPage(page, 'blog'), locale, 'nav.blog')
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
    (p: Page) => new BlogListJourney(p, locale),
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
    () => new BlogUserJourney(page, contentListPage(page, 'blog')),
    async (p: Page) => {
      if (viewport) await p.setViewportSize(viewport)
    },
  )
