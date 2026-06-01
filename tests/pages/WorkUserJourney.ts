import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { visit } from '@tests/pages/UserJourneyFactory'
import { ContentListPage, contentListPage } from '@tests/pages/ContentListPage'
import { getURLForSection } from '@utils/sections'
import { ContentListJourney, WorkProjectCommunityDetailJourney } from '@tests/pages/ContentUserJourney'

export class WorkListJourney extends ContentListJourney {
  constructor(page: Page, list: ContentListPage, locale: UILanguages) {
    super(page, list, locale, 'nav.work')
  }

  clickItem(slug: string) {
    const href = `${getURLForSection('work', this.locale)}/${slug}`
    return this.list.clickItemAndReturn(href, `click work item "${slug}"`, () => {
      return new WorkDetailJourney(this.page, this.list, this.locale)
    })
  }
}

export class WorkDetailJourney extends WorkProjectCommunityDetailJourney {}

export const userInWorkList = (page: Page, locale: UILanguages) =>
  visit(
    `a user in work list ${locale}`,
    page,
    getURLForSection('work', locale),
    (p) => new WorkListJourney(p, contentListPage(p), locale),
  )

export const userInWorkDetail = (page: Page, locale: UILanguages, slug: string) =>
  visit(
    `a user in work detail ${locale} ${slug}`,
    page,
    `${getURLForSection('work', locale)}/${slug}`,
    (p) => new WorkDetailJourney(p, contentListPage(p), locale),
  )
