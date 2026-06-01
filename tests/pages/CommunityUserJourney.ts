import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { visit } from '@tests/pages/UserJourneyFactory'
import { ContentListPage, contentListPage } from '@tests/pages/ContentListPage'
import { getURLForSection } from '@utils/sections'
import { ContentListJourney, WorkProjectCommunityDetailJourney } from '@tests/pages/ContentUserJourney'

export class CommunityListJourney extends ContentListJourney {
  constructor(page: Page, list: ContentListPage, locale: UILanguages) {
    super(page, list, locale, 'nav.community')
  }

  clickItem(slug: string) {
    const href = `${getURLForSection('community', this.locale)}/${slug}`
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
    getURLForSection('community', locale),
    (p) => new CommunityListJourney(p, contentListPage(p), locale),
  )

export const userInCommunityDetail = (page: Page, locale: UILanguages, slug: string) =>
  visit(
    `a user in community detail ${locale} ${slug}`,
    page,
    `${getURLForSection('community', locale)}/${slug}`,
    (p) => new CommunityDetailJourney(p, contentListPage(p), locale),
  )
