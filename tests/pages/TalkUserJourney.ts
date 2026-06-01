import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { visit } from '@tests/pages/UserJourneyFactory'
import { ContentListPage, contentListPage } from '@tests/pages/ContentListPage'
import { getURLForSection } from '@utils/sections'
import { ContentListJourney, ContentDetailJourney } from '@tests/pages/ContentUserJourney'

export class TalkListJourney extends ContentListJourney {
  constructor(page: Page, list: ContentListPage, locale: UILanguages) {
    super(page, list, locale, 'nav.talks')
  }

  clickItem(slug: string) {
    const href = `${getURLForSection('talk', this.locale)}/${slug}`
    return this.list.clickItemAndReturn(href, `click talk item "${slug}"`, () => {
      return new TalkDetailJourney(this.page, this.list, this.locale)
    })
  }
}

export class TalkDetailJourney extends ContentDetailJourney {
  shouldHaveTags(ariaSnapshot: string) {
    return this.list.shouldHaveTags(ariaSnapshot)
  }

  shouldHaveComments() {
    return this.list.shouldHaveComments(this.locale)
  }
}

export const userInTalkList = (page: Page, locale: UILanguages) =>
  visit(
    `a user in talk list ${locale}`,
    page,
    getURLForSection('talk', locale),
    (p) => new TalkListJourney(p, contentListPage(p), locale),
  )

export const userInTalkDetail = (page: Page, locale: UILanguages, slug: string) =>
  visit(
    `a user in talk detail ${locale} ${slug}`,
    page,
    `${getURLForSection('talk', locale)}/${slug}`,
    (p) => new TalkDetailJourney(p, contentListPage(p), locale),
  )
