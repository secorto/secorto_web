import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { getURLForSection, getEntryURL } from '@domain/section'
import { ContentListPage, PostListPageMain, createContentListPageFactory } from './ContentListPage'
import { ContentDetailPage, createPostDetail } from './ContentDetailPage'
import { visit } from '@tests/support/ui/shared/NavigationPaths'
import type { ContentTypeFlow } from './types'

function createTalkListPage(page: Page) {
  return createContentListPageFactory(page, 'talk', PostListPageMain)
}

function createTalkDetailPage(page: Page) {
  return createPostDetail(page, 'talk')
}

export async function userInTalkList(page: Page, locale: UILanguages): Promise<ContentListPage> {
  return visit(
    `a user in talk list ${locale}`,
    page,
    getURLForSection('talk', locale),
    (p: Page) => createTalkListPage(p),
  )
}

export async function userInTalkDetail(
  page: Page,
  locale: UILanguages,
  slug: string,
): Promise<ContentDetailPage> {
  return visit(
    `a user in talk detail ${locale} ${slug}`,
    page,
    getEntryURL('talk', locale, slug),
    (p: Page) => createTalkDetailPage(p),
  )
}

export const talkFlow: ContentTypeFlow<ContentListPage> = {
  name: 'talk',
  testTag: 'python',
  testSlug: '2022-08-14-screenpy',
  userInList: userInTalkList,
  createDetail: createTalkDetailPage,
} as const
