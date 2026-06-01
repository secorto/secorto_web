import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { visit } from '@tests/pages/UserJourneyFactory'

import { ContentListPage, contentListPage } from '@tests/pages/ContentListPage'
import { getURLForSection } from '@utils/sections'
import { ContentListJourney, WorkProjectCommunityDetailJourney } from '@tests/pages/ContentUserJourney'

export class ProjectListJourney extends ContentListJourney {
  constructor(page: Page, list: ContentListPage, locale: UILanguages) {
    super(page, list, locale, 'nav.projects')
  }

  clickItem(slug: string) {
    const href = `${getURLForSection('projects', this.locale)}/${slug}`
    return this.list.clickItemAndReturn(href, `click project item "${slug}"`, () => {
      return new ProjectDetailJourney(this.page, this.list, this.locale)
    })
  }
}

export class ProjectDetailJourney extends WorkProjectCommunityDetailJourney {
  shouldHaveTags(ariaSnapshot: string) {
    return this.list.shouldHaveTags(ariaSnapshot)
  }
}

export const userInProjectList = (page: Page, locale: UILanguages) =>
  visit(
    `a user in project list ${locale}`,
    page,
    getURLForSection('projects', locale),
    (p) => new ProjectListJourney(p, contentListPage(p), locale),
  )

export const userInProjectDetail = (page: Page, locale: UILanguages, slug: string) =>
  visit(
    `a user in project detail ${locale} ${slug}`,
    page,
    `${getURLForSection('projects', locale)}/${slug}`,
    (p) => new ProjectDetailJourney(p, contentListPage(p), locale),
  )
