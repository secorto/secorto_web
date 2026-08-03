import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { getURLForSection, getEntryURL } from '@domain/section'
import { ContentListPage, PostListPageMain, createContentListPageFactory } from './ContentListPage'
import { ContentDetailPage, createPostDetail } from './ContentDetailPage'
import { visit } from '@tests/support/ui/shared/NavigationPaths'
import type { ContentTypeFlow } from './types'

function createBlogListPage(page: Page) {
  return createContentListPageFactory(page, 'blog', PostListPageMain)
}

function createBlogDetailPage(page: Page) {
  return createPostDetail(page, 'blog')
}

export async function userInBlogList(page: Page, locale: UILanguages): Promise<ContentListPage> {
  return visit(
    `a user in blog list ${locale}`,
    page,
    getURLForSection('blog', locale),
    (p: Page) => createBlogListPage(p),
  )
}

export async function userInBlogPost(
  page: Page,
  locale: UILanguages,
  slug: string,
): Promise<ContentDetailPage> {
  return visit(
    `a user opening blog post ${slug} in ${locale}`,
    page,
    getEntryURL('blog', locale, slug),
    (p: Page) => createBlogDetailPage(p),
  )
}

export const blogFlow: ContentTypeFlow<ContentListPage> = {
  name: 'blog',
  testTag: 'python',
  testSlug: '2022-07-11-intro-python',
  userInList: userInBlogList,
  createDetail: createBlogDetailPage,
} as const

