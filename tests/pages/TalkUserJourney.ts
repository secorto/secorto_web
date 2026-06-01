import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { ui } from '@i18n/ui'
import { step } from '@tests/fixtures'
import { visit } from '@tests/pages/UserJourneyFactory'
import { ContentListPage } from '@tests/pages/ContentListPage'
import { getURLForSection } from '@utils/sections'
import { ContentListJourney, ContentDetailJourney } from '@tests/pages/ContentUserJourney'

export class TalkListJourney extends ContentListJourney {
  constructor(page: Page, list: ContentListPage, locale: UILanguages) {
    super(page, list, locale, 'nav.talks')
  }

  filterByTag(tag: string) {
    return step(`filter talks by tag "${tag}"`, async ({ expect }) => {
      const tagLink = this.list.tagLink(tag)
      await expect(tagLink).not.toHaveClass(/active/)
      await tagLink.click()
      await expect(tagLink).toHaveClass(/active/)
    })
  }

  shouldShowFilteredTitle(tag: string) {
    return step(`header shows filtered title with "${tag}"`, async ({ expect }) => {
      await expect(this.list.headerTitle()).toHaveText(`${ui[this.locale]['nav.talks']} - ${tag}`)
    })
  }

  clickItem(slug: string) {
    return step(`click talk item "${slug}"`, async () => {
      const href = `${getURLForSection('talk', this.locale)}/${slug}`
      await this.list.itemLink(href).click()
      return new TalkDetailJourney(this.page, this.list, this.locale)
    })
  }
}

export class TalkDetailJourney extends ContentDetailJourney {
  shouldHaveTags(ariaSnapshot: string) {
    return step('talk detail has expected tags', async ({ expect }) => {
      await expect(this.list.tags()).toMatchAriaSnapshot(ariaSnapshot)
    })
  }

  shouldHaveComments() {
    return step('talk detail has comments section', async ({ expect }) => {
      await expect(this.list.commentsScript()).toHaveCount(1)
      await expect(this.list.commentsScript()).toHaveAttribute('data-lang', this.locale)
      await expect(this.list.commentsScript()).toHaveAttribute('data-repo', 'secorto/secorto_web')
      await expect(this.list.commentsFrame()).toBeVisible()
    })
  }
}

export const userInTalkList = (page: Page, locale: UILanguages) =>
  visit(
    `a user in talk list ${locale}`,
    page,
    getURLForSection('talk', locale),
    (p) => new TalkListJourney(p, new ContentListPage(p), locale),
  )

export const userInTalkDetail = (page: Page, locale: UILanguages, slug: string) =>
  visit(
    `a user in talk detail ${locale} ${slug}`,
    page,
    `${getURLForSection('talk', locale)}/${slug}`,
    (p) => new TalkDetailJourney(p, new ContentListPage(p), locale),
  )
