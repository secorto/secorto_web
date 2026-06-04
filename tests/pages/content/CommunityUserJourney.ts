import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { visit } from '@tests/pages/shared/UserJourneyFactory'
import { ContentListPage, contentListPage } from '@tests/pages/content/ContentListPage'
import { contentListPath, contentDetailsPath } from '@tests/pages/shared/NavigationPaths'
import { ContentListJourney, WorkProjectCommunityDetailJourney } from '@tests/pages/content/ContentUserJourney'

export class CommunityListJourney extends ContentListJourney {
  constructor(page: Page, list: ContentListPage, locale: UILanguages) {
    super(page, list, locale, 'nav.community')
  }

  clickItem(slug: string) {
    const href = contentDetailsPath('community', this.locale, slug)
    return this.list.clickItemAndReturn(href, `click community item "${slug}"`, () => {
      return new CommunityDetailJourney(this.page, this.list, this.locale)
    })
  }
}

export class CommunityDetailJourney extends WorkProjectCommunityDetailJourney {}

export const userInCommunityList = (page: Page, locale: UILanguages) =>
  visit(
    `a user in community list ${locale}`,
    page,
    contentListPath('community', locale),
    (p) => new CommunityListJourney(p, contentListPage(p, 'community'), locale),
  )

export const userInCommunityDetail = (page: Page, locale: UILanguages, slug: string) =>
  visit(
    `a user in community detail ${locale} ${slug}`,
    page,
    contentDetailsPath('community', locale, slug),
    (p) => new CommunityDetailJourney(p, contentListPage(p, 'community'), locale),
  )
