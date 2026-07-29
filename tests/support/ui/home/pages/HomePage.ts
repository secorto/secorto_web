import { target } from '@tests/support/ui/components/Target'
import type { Page } from '@playwright/test'
import type { Target as TargetComponent } from '@tests/support/ui/components/Target'
import { footerPage } from '@tests/support/ui/home/component/FooterComponent'
import { sidebarPage } from '@tests/support/ui/sidebar/SidebarPage'
import { homeHighlights } from '@tests/support/ui/home/HomeHighlights'
import type { HomeHighlights as HomeHighlightsComponent } from '@tests/support/ui/home/HomeHighlights'
import type { UILanguages } from '@i18n/ui'
import { ui } from '@i18n/ui'
import { homePath, visit } from '@tests/support/ui/shared/NavigationPaths'
import { verifyStep } from '@tests/fixtures'
import { sectionsConfig } from '@domain/section'
import { mainLayout, type MainLayoutComponent } from '@tests/support/ui/shared/components/MainLayout'
import type { LocalizedPage } from '../../shared/contracts/LocalizedPage'

export class HomePageMain implements LocalizedPage<void> {
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
    readonly mainLayout: MainLayoutComponent,
  ) {}

  shouldBeLoaded(locale: UILanguages) {
    return verifyStep('homepage is loaded correctly', async ({ expect }) => {
      await this.mainLayout.shouldBeLoaded(locale).with(expect)
    })
  }
}

export function homePage(page: Page) {
  const main = new HomePageMain(
    target('home avatar', page.locator('.home-avatar svg')),
    target('home bio text', page.locator('.home-bio-text')),
    homeHighlights(page.locator('.highlights')),
  )
  return new HomePage(
    mainLayout({
      root: target('html root', page.locator('html')),
      headerTitle: target('home header title', page.getByRole('heading', { level: 1 })),
      main: main,
      sidebar: sidebarPage(page),
      footer: footerPage(page),
    })
  )
}

export const userInHome = (
  page: Page,
  locale: UILanguages,
  preAct?: (page: Page) => Promise<void> | void,
) =>
  visit(
    `a user opening home in ${locale} for theme/locale`,
    page,
    homePath(locale),
    homePage,
    preAct
  )
