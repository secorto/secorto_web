import { target } from '@tests/support/ui/target/target'
import { relatedContentSection, RelatedContentSection } from '@tests/support/ui/content/components/RelatedCard'
import type { Page } from '@playwright/test'
import type { TargetComponent } from '@tests/support/ui/target/target'
import type { UILanguages } from '@i18n/ui'
import { LocalizedNavigablePage, visit, createPageContext, type PageContext } from '@tests/support/ui/shared/pages'
import { verifyStep, type Step } from '@tests/step'
import type { LocalizedPage } from '@tests/support/ui/shared/contracts/localization'

export class HomePageMain implements LocalizedPage<void> {
  constructor(
    readonly avatar: TargetComponent,
    readonly bioText: TargetComponent,
    readonly relatedCards: RelatedContentSection,
  ) {}

  shouldBeLocalized(_locale: UILanguages) {
    return verifyStep('homepage main is localized', async ({ expect }) => {
      await this.avatar.should.beVisible(expect)
      await this.bioText.should.beVisible(expect)
      await this.relatedCards.shouldBeValid().with(expect)
    })
  }
}

export class HomePage extends LocalizedNavigablePage {
  constructor(context: PageContext) {
    super(context)
  }

  protected expectedUrl(locale: UILanguages): string | RegExp {
    return new RegExp(`/${locale}(/|$)`)
  }
}

export function homePage(page: Page) {
  const main = new HomePageMain(
    target('home avatar', page.locator('.home-avatar svg')),
    target('home bio text', page.locator('.home-bio-text')),
    relatedContentSection(page.locator('.related-content-section')),
  )
  const context = createPageContext(page, 'home', main)
  return new HomePage(context)
}

export const userInHome = (
  page: Page,
  locale: UILanguages,
  preAct?: (page: Page) => Step<void> | void,
) =>
  visit(
    `a user opening home in ${locale} for theme/locale`,
    page,
    `/${locale}/`,
    homePage,
    preAct
  )
