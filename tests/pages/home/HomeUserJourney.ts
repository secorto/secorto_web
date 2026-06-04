import type { UILanguages } from '@i18n/ui'
import type { SidebarPage } from '@tests/pages/sidebar/SidebarPage'
import { sidebarPage } from '@tests/pages/sidebar/SidebarPage'
import { userInHomeFactory } from '@tests/pages/shared/UserJourneyFactory'
import { step } from '@tests/fixtures'
import { pageHelper } from '@tests/pages/components/PageHelper'
import type { PageHelper } from '@tests/pages/components/PageHelper'
import { homePage, HomePage } from '@tests/pages/home/HomePage'
import type { Page } from '@playwright/test'

export class HomeUserJourney {
  constructor(
    readonly home: HomePage,
    readonly sidebar: SidebarPage,
    readonly page: PageHelper,
  ) {}

  shouldHaveAvatar() {
    return this.home.avatar.shouldBeVisible()
  }

  shouldHaveBioText() {
    return this.home.bioText.shouldBeVisible()
  }

  shouldHavePyBAQ(i18n: Record<string, string>) {
    return this.home.homeHighlights.pybaq.shouldHavePyBAQ(i18n)
  }

  shouldHaveTitle() {
    return step('page and header have a title', async () => {
      await this.page.shouldHaveTitle()
      await this.home.shouldHaveTitle()
    })
  }

  blogHrefMatches(locale: string, blogRoute: string) {
    return this.home.homeHighlights.blog.hrefMatches(locale, blogRoute)
  }

  talkHrefMatches(locale: string, talkRoute: string) {
    return this.home.homeHighlights.talk.hrefMatches(locale, talkRoute)
  }

  shouldHaveAboutLink(i18n: Record<string, string>) {
    return this.sidebar.shouldHaveAboutLink(i18n)
  }
}

export const userInHome = (page: Page, locale: UILanguages) =>
  userInHomeFactory(`a user in ${locale}`, page, locale, () =>
    new HomeUserJourney(homePage(page), sidebarPage(page), pageHelper(page)),
  )
