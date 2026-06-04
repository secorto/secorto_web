import { target } from '@tests/pages/components/Target'
import type { Page } from '@playwright/test'
import type { Target as TargetComponent } from '@tests/pages/components/Target'
import { homeHighlights } from '@tests/pages/home/HomeHighlights'
import type { HomeHighlights as HomeHighlightsComponent } from '@tests/pages/home/HomeHighlights'
import type { UILanguages } from '@i18n/ui'
import { homePath, visit } from '@tests/pages/shared/NavigationPaths'

export class HomePage {
  constructor(
    readonly headerTitle: TargetComponent,
    readonly avatar: TargetComponent,
    readonly bioText: TargetComponent,
    readonly homeHighlights: HomeHighlightsComponent,
  ) {}

  shouldHaveTitle() {
    return this.headerTitle.shouldHaveVisibleText(/\S+/)
  }


  shouldHaveAvatar() {
    return this.avatar.shouldBeVisible()
  }

  shouldHaveBioText() {
    return this.bioText.shouldBeVisible()
  }

  shouldHavePyBAQ(i18n: Record<string, string>) {
    return this.homeHighlights.pybaq.shouldHavePyBAQ(i18n)
  }

  blogHrefMatches(locale: string, blogRoute: string) {
    return this.homeHighlights.blog.hrefMatches(locale, blogRoute)
  }

  talkHrefMatches(locale: string, talkRoute: string) {
    return this.homeHighlights.talk.hrefMatches(locale, talkRoute)
  }
}

export function homePage(page: Page) {
  return new HomePage(
    target('home header title', page.getByRole('heading', { level: 1 })),
    target('home avatar', page.locator('.home-avatar svg')),
    target('home bio text', page.locator('.home-bio-text')),
    homeHighlights(page.locator('.highlights')),
  )
}

export const userInHome = (page: Page, locale: UILanguages) =>
  visit(`a user opening home in ${locale} for menu flow`, page, homePath(locale), homePage)

