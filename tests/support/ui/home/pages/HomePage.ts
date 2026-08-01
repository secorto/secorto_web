import { target, targetSelector } from '@tests/support/ui/components/Target'
import type { Page } from '@playwright/test'
import type { Target as TargetComponent, TargetSelector } from '@tests/support/ui/components/Target'
import type { UILanguages } from '@i18n/ui'
import { homePath, visit } from '@tests/support/ui/shared/NavigationPaths'
import { verifyStep, type Verification } from '@tests/fixtures'
import { defaultMainLayout, mainLayout, type MainLayoutComponent } from '@tests/support/ui/shared/components/MainLayout'
import type { LocalizedPage, LocalizedUrl } from '@tests/support/ui/shared/contracts/localization'
import { urlValidator } from '@tests/support/ui/shared/flows/urlValidator'
import { a11yFlow, type A11y } from '@tests/support/ui/shared/flows/a11y'

export class HomePageMain implements LocalizedPage<void> {
  constructor(
    readonly avatar: TargetComponent,
    readonly bioText: TargetComponent,
    readonly homeHighlights: TargetSelector<string>,
  ) {}

  shouldBeLoaded(_locale: UILanguages) {
    return verifyStep('homepage main is loaded correctly', async ({ expect }) => {
      await this.avatar.shouldBeVisible().with(expect)
      await this.bioText.shouldBeVisible().with(expect)
      await this.homeHighlights.get('talk').shouldBeVisible().with(expect)
      await this.homeHighlights.get('blog').shouldBeVisible().with(expect)
      await this.homeHighlights.get('work').shouldBeVisible().with(expect)
      await this.homeHighlights.get('community').shouldBeVisible().with(expect)
    })
  }
}

export class HomePage implements LocalizedPage<void>, LocalizedUrl {
  constructor(
    readonly mainLayout: MainLayoutComponent,
    readonly validateUrl: (expected: string | RegExp) => Verification<void>,
    readonly a11y: A11y,
  ) {}

  shouldBeLoaded(locale: UILanguages) {
    return this.mainLayout.shouldBeLoaded(locale)
  }

  shouldBeInLocale(locale: UILanguages) {
    const expected = new RegExp(`/${locale}(/|$)`)
    return this.validateUrl(expected)
  }

  async auditA11y() {
    await this.a11y.audit()
  }
}

export function homePage(page: Page) {
  const main = new HomePageMain(
    target('home avatar', page.locator('.home-avatar svg')),
    target('home bio text', page.locator('.home-bio-text')),
    targetSelector(`highlight item link`, (name: string) => page.locator(`.highlight-card`, {
      has: page.locator('.highlight-label', { hasText: name })
    })),
  )
  return new HomePage(
    mainLayout({
      ...defaultMainLayout(page),
      name: 'home',
      headerTitle: target('home header title', page.getByRole('heading', { level: 1 })),
      main: main,
    }),
    urlValidator(page),
    a11yFlow(page),
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
