import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { visit } from '@tests/pages/UserJourneyFactory'
import { ContentListPage } from '@tests/pages/ContentListPage'
import { getURLForSection } from '@utils/sections'
import { ContentListJourney, WorkProjectCommunityDetailJourney } from '@tests/pages/ContentUserJourney'

export class CommunityListJourney extends ContentListJourney {
  constructor(page: Page, list: ContentListPage, locale: UILanguages) {
    super(page, list, locale, 'nav.community')
  }
}

export class CommunityDetailJourney extends WorkProjectCommunityDetailJourney {}

export const userInCommunityList = (page: Page, locale: UILanguages) =>
  visit(
    `a user in community list ${locale}`,
    page,
    getURLForSection('community', locale),
    (p) => new CommunityListJourney(p, new ContentListPage(p), locale),
  )

export const userInCommunityDetail = (page: Page, locale: UILanguages, slug: string) =>
  visit(
    `a user in community detail ${locale} ${slug}`,
    page,
    `${getURLForSection('community', locale)}/${slug}`,
    (p) => new CommunityDetailJourney(p, new ContentListPage(p), locale),
  )
