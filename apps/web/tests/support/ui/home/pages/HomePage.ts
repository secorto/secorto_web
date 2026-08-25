import { target } from '@tests/support/ui/components/Target'
import { highlightCards, HighlightCards } from '@tests/support/ui/components/HighlightCard'
import type { Page } from '@playwright/test'
import type { Target as TargetComponent } from '@tests/support/ui/components/Target'
import type { UILanguages } from '@i18n/ui'
import { homePath, visit } from '@tests/support/ui/shared/NavigationPaths'
import { verifyStep, type Step, type Verification } from '@tests/step'
import { defaultMainLayout, mainLayout, type MainLayoutComponent } from '@tests/support/ui/shared/components/MainLayout'
import type { AuditablePage, Loadable, LocalizedPage, LocalizedUrl } from '@tests/support/ui/shared/contracts/localization'
import { urlValidator } from '@tests/support/ui/shared/flows/urlValidator'
import { a11yFlow, type A11y } from '@tests/support/ui/shared/flows/a11y'

export class HomePageMain implements LocalizedPage<void> {
  constructor(
    readonly avatar: TargetComponent,
    readonly bioText: TargetComponent,
    readonly highlightCards: HighlightCards,
  ) {}

  shouldBeLocalized(_locale: UILanguages) {
    return verifyStep('homepage main is localized', async ({ expect }) => {
      await this.avatar.shouldBeVisible().with(expect)
      await this.bioText.shouldBeVisible().with(expect)
      await this.highlightCards.shouldBeValid().with(expect)
    })
  }
}

export class HomePage implements Loadable, LocalizedPage<void>, LocalizedUrl, AuditablePage {
  constructor(
    readonly mainLayout: MainLayoutComponent,
    readonly validateUrl: (expected: string | RegExp) => Verification<void>,
    readonly a11y: A11y,
  ) {}

  shouldBeLoaded() {
    return this.mainLayout.shouldBeLoaded()
  }

  shouldBeLocalized(locale: UILanguages) {
    return verifyStep(`homepage is localized in ${locale}`, async ({ expect }) => {
      await this.shouldBeInLocale(locale).with(expect)
      await this.mainLayout.shouldBeLocalized(locale).with(expect)
    })
  }

  shouldBeInLocale(locale: UILanguages) {
    const expected = new RegExp(`/${locale}(/|$)`)
    return this.validateUrl(expected)
  }

  auditA11y() {
    return this.a11y.audit()
  }
}

export function homePage(page: Page) {
  const main = new HomePageMain(
    target('home avatar', page.locator('.home-avatar svg')),
    target('home bio text', page.locator('.home-bio-text')),
    highlightCards(page.locator('.highlight-card')),
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
  preAct?: (page: Page) => Step<void> | void,
) =>
  visit(
    `a user opening home in ${locale} for theme/locale`,
    page,
    homePath(locale),
    homePage,
    preAct
  )
