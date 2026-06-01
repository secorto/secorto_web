import type { UILanguages } from '@i18n/ui'
import type { Page } from '@playwright/test'
import type { SidebarPage } from '@tests/pages/SidebarPage'
import { sidebarPage } from '@tests/pages/SidebarPage'
import { target } from '@tests/pages/Target'
import type { Target as TargetComponent } from '@tests/pages/Target'
import { homeHighlights } from '@tests/pages/HomeHighlights'
import type { HomeHighlights as HomeHighlightsComponent } from '@tests/pages/HomeHighlights'
import { step } from '@tests/fixtures'
import { mockThirdParty } from '@tests/e2e/helpers/mockThirdParty'
import { pageHelper } from '@tests/pages/Page'
import type { PageHelper } from '@tests/pages/Page'

export class HomePage {
  constructor(
    readonly headerTitle: TargetComponent,
    readonly avatar: TargetComponent,
    readonly bioText: TargetComponent,
    readonly homeHighlights: HomeHighlightsComponent,
  ) {}
}

export function homePage(page: Page) {
  return new HomePage(
    target(page.getByRole('heading', { level: 1 })),
    target(page.locator('.home-avatar svg')),
    target(page.locator('.home-bio-text')),
    homeHighlights(page.locator('.highlights')),
  )
}

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
    return step('page and header have a title', async ({ expect }) => {
      await this.page.shouldHaveTitle()
      await expect(this.home.headerTitle.locator).toBeVisible()
      await expect(this.home.headerTitle.locator).toHaveText(/\S+/)
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
  step(`a user in ${locale}`, async () => {
    await page.goto(`/${locale}/`)
    await mockThirdParty(page)
    return new HomeUserJourney(homePage(page), sidebarPage(page), pageHelper(page))
  })
