import { target } from '@tests/support/ui/components/Target'
import type { Page } from '@playwright/test'
import type { Target as TargetComponent } from '@tests/support/ui/components/Target'
import { footerPage, type FooterComponent } from '@tests/support/ui/home/component/FooterComponent'
import { homeHighlights } from '@tests/support/ui/home/HomeHighlights'
import type { HomeHighlights as HomeHighlightsComponent } from '@tests/support/ui/home/HomeHighlights'
import type { UILanguages } from '@i18n/ui'
import { ui } from '@i18n/ui'
import { homePath, visit } from '@tests/support/ui/shared/NavigationPaths'
import { verifyStep } from '@tests/fixtures'
import { sectionsConfig } from '@domain/section'

export class HomePageMain {
  constructor(
    readonly avatar: TargetComponent,
    readonly bioText: TargetComponent,
    readonly homeHighlights: HomeHighlightsComponent,
  ) {}

  shouldBeLoaded(locale: UILanguages) {
    return verifyStep('homepage main is loaded correctly', async ({ expect }) => {
      const blogRoute = sectionsConfig.blog.routes[locale]
      const talkRoute = sectionsConfig.talk.routes[locale]
      await this.avatar.shouldBeVisible().with(expect)
      await this.bioText.shouldBeVisible().with(expect)
      await this.homeHighlights.pybaq.shouldHavePyBAQ(ui[locale]).with(expect)
      await this.homeHighlights.blog.hrefMatches(locale, blogRoute).with(expect)
      await this.homeHighlights.talk.hrefMatches(locale, talkRoute).with(expect)
    })
  }
}

export class HomePage {
  constructor(
    readonly headerTitle: TargetComponent,
    readonly homePageMain: HomePageMain,
    readonly footer: FooterComponent,
  ) {}

  shouldBeLoaded(locale: UILanguages) {
    return verifyStep('homepage is loaded correctly', async ({ expect }) => {
      await this.headerTitle.shouldHaveVisibleText(/\S+/).with(expect)
      await this.homePageMain.shouldBeLoaded(locale).with(expect)
      await this.footer.shouldBeLoaded(locale).with(expect)
    })
  }
}

export function homePage(page: Page) {
  return new HomePage(
    target('home header title', page.getByRole('heading', { level: 1 })),
    new HomePageMain(
      target('home avatar', page.locator('.home-avatar svg')),
      target('home bio text', page.locator('.home-bio-text')),
      homeHighlights(page.locator('.highlights')),
    ),
    footerPage(page),
  )
}

export const userInHome = (page: Page, locale: UILanguages) =>
  visit(`a user opening home in ${locale} for menu flow`, page, homePath(locale), homePage)

