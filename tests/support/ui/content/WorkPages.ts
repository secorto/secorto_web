import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { getURLForSection, getEntryURL } from '@domain/section'
import { ContentListPage, ExperienceListPageMain, createContentListPageFactory } from './ContentListPage'
import { ContentExperienceDetailPage, createExperienceDetail } from './ContentExperienceDetailPage'
import { visit } from '@tests/support/ui/shared/NavigationPaths'
import type { ContentTypeFlow } from './types'

function createWorkListPage(page: Page) {
  return createContentListPageFactory(page, 'work', ExperienceListPageMain)
}

function createWorkDetailPage(page: Page) {
  return createExperienceDetail(page, 'work')
}

export async function userInWorkList(page: Page, locale: UILanguages): Promise<ContentListPage> {
  return visit(
    `a user in work list ${locale}`,
    page,
    getURLForSection('work', locale),
    (p: Page) => createWorkListPage(p),
  )
}

export async function userInWorkDetail(
  page: Page,
  locale: UILanguages,
  slug: string,
): Promise<ContentExperienceDetailPage> {
  return visit(
    `a user in work detail ${locale} ${slug}`,
    page,
    getEntryURL('work', locale, slug),
    (p: Page) => createWorkDetailPage(p),
  )
}

export const workFlow: ContentTypeFlow<ContentListPage> = {
  name: 'work',
  testTag: 'dev',
  testSlug: 'coruniamericana',
  userInList: userInWorkList,
  createDetail: createWorkDetailPage,
} as const

