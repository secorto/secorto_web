import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { ContentListPage, contentListPage } from '@tests/support/ui/content/ContentListPage'
import { contentListPath, contentDetailsPath, visit } from '@tests/support/ui/shared/NavigationPaths'

export const userInBlogList = (page: Page, locale: UILanguages) =>
  visit(
    `a user in blog list ${locale}`,
    page,
    contentListPath('blog', locale),
    (p: Page): ContentListPage => contentListPage(p, 'blog'),
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
    () => contentListPage(page, 'blog'),
    async (p: Page) => {
      if (viewport) await p.setViewportSize(viewport)
    },
  )
