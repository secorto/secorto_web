import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { visit } from '@tests/pages/shared/UserJourneyFactory'
import { ContentListPage, contentListPage } from '@tests/pages/content/ContentListPage'
import { contentListPath, contentDetailsPath } from '@tests/pages/shared/NavigationPaths'
import { ContentListJourney, WorkProjectCommunityDetailJourney } from '@tests/pages/content/ContentUserJourney'

export class ProjectListJourney extends ContentListJourney {
  constructor(page: Page, list: ContentListPage, locale: UILanguages) {
    super(page, list, locale, 'nav.projects')
  }

  clickItem(slug: string) {
    const href = contentDetailsPath('projects', this.locale, slug)
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
    contentListPath('projects', locale),
    (p) => new ProjectListJourney(p, contentListPage(p), locale),
  )

export const userInProjectDetail = (page: Page, locale: UILanguages, slug: string) =>
  visit(
    `a user in project detail ${locale} ${slug}`,
    page,
    contentDetailsPath('projects', locale, slug),
    (p) => new ProjectDetailJourney(p, contentListPage(p), locale),
  )
