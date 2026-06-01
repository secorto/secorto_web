import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { step } from '@tests/fixtures'
import { visit } from '@tests/pages/UserJourneyFactory'

import { ContentListPage } from '@tests/pages/ContentListPage'
import { getURLForSection } from '@utils/sections'
import { ContentListJourney, WorkProjectCommunityDetailJourney } from '@tests/pages/ContentUserJourney'

export class ProjectListJourney extends ContentListJourney {
  constructor(page: Page, list: ContentListPage, locale: UILanguages) {
    super(page, list, locale, 'nav.projects')
  }
}

export class ProjectDetailJourney extends WorkProjectCommunityDetailJourney {
  shouldHaveTags(ariaSnapshot: string) {
    return step('project detail has expected tags', async ({ expect }) => {
      await expect(this.list.tags()).toMatchAriaSnapshot(ariaSnapshot)
    })
  }
}

export const userInProjectList = (page: Page, locale: UILanguages) =>
  visit(
    `a user in project list ${locale}`,
    page,
    getURLForSection('projects', locale),
    (p) => new ProjectListJourney(p, new ContentListPage(p), locale),
  )

export const userInProjectDetail = (page: Page, locale: UILanguages, slug: string) =>
  visit(
    `a user in project detail ${locale} ${slug}`,
    page,
    `${getURLForSection('projects', locale)}/${slug}`,
    (p) => new ProjectDetailJourney(p, new ContentListPage(p), locale),
  )
