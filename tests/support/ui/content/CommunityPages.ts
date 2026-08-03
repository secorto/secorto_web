import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { getURLForSection, getEntryURL } from '@domain/section'
import { ContentListPage, ExperienceListPageMain, createContentListPageFactory } from './ContentListPage'
import { ContentExperienceDetailPage, createExperienceDetail } from './ContentExperienceDetailPage'
import { visit } from '@tests/support/ui/shared/NavigationPaths'
import type { ContentTypeFlow } from './types'

function createCommunityListPage(page: Page) {
  return createContentListPageFactory(page, 'community', ExperienceListPageMain)
}

function createCommunityDetailPage(page: Page) {
  return createExperienceDetail(page, 'community')
}

export async function userInCommunityList(page: Page, locale: UILanguages): Promise<ContentListPage> {
  return visit(
    `a user in community list ${locale}`,
    page,
    getURLForSection('community', locale),
    (p: Page) => createCommunityListPage(p),
  )
}

export async function userInCommunityDetail(
  page: Page,
  locale: UILanguages,
  slug: string,
): Promise<ContentExperienceDetailPage> {
  return visit(
    `a user in community detail ${locale} ${slug}`,
    page,
    getEntryURL('community', locale, slug),
    (p: Page) => createCommunityDetailPage(p),
  )
}

export const communityFlow: ContentTypeFlow<ContentListPage> = {
  name: 'community',
  testTag: 'python',
  testSlug: 'pybaq',
  userInList: userInCommunityList,
  createDetail: createCommunityDetailPage,
} as const

