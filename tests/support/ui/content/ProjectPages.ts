import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { getURLForSection, getEntryURL } from '@domain/section'
import { ContentListPage, ExperienceListPageMain, createContentListPageFactory } from './ContentListPage'
import { ContentExperienceDetailPage, createExperienceDetail } from './ContentExperienceDetailPage'
import { visit } from '@tests/support/ui/shared/NavigationPaths'
import type { ContentTypeFlow } from './types'

function createProjectListPage(page: Page) {
  return createContentListPageFactory(page, 'projects', ExperienceListPageMain)
}

function createProjectDetailPage(page: Page) {
  return createExperienceDetail(page, 'projects')
}

export async function userInProjectList(page: Page, locale: UILanguages): Promise<ContentListPage> {
  return visit(
    `a user in project list ${locale}`,
    page,
    getURLForSection('projects', locale),
    (p: Page) => createProjectListPage(p),
  )
}

export async function userInProjectDetail(
  page: Page,
  locale: UILanguages,
  slug: string,
): Promise<ContentExperienceDetailPage> {
  return visit(
    `a user in project detail ${locale} ${slug}`,
    page,
    getEntryURL('projects', locale, slug),
    (p: Page) => createProjectDetailPage(p),
  )
}

export const projectFlow: ContentTypeFlow<ContentListPage> = {
  name: 'projects',
  testTag: 'dev',
  testSlug: 'scot3004',
  userInList: userInProjectList,
  createDetail: createProjectDetailPage,
} as const

