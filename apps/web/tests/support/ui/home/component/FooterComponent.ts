import { ui, type UILanguages } from '@i18n/ui'
import type { Page } from '@playwright/test'
import { verifyStep } from '@tests/step'
import { target, Target as TargetComponent } from '@tests/support/ui/components/Target'
import type { Loadable, LocalizedPage } from '@tests/support/ui/shared/contracts/localization'

export class FooterComponent implements Loadable, LocalizedPage<void> {
  constructor(
    readonly logo: TargetComponent,
    readonly follow: TargetComponent,
  ) {}

  shouldBeLoaded() {
    return verifyStep('footer is loaded', async ({ expect }) => {
      await this.follow.shouldBeVisible(expect)
    })
  }

  shouldBeLocalized(locale: UILanguages) {
    return verifyStep('footer is localized correctly', async ({ expect }) => {
      const i18n = ui[locale]
      await this.follow.shouldHaveText(expect, i18n['footer.follow'])
      await this.logo.shouldHaveText(expect, i18n['footer.logo_alt'])
    })
  }
}

export function footerPage(page: Page) {
  return new FooterComponent(
    target('footer logo', page.getByTestId('footer-logo')),
    target('footer follow', page.getByTestId('footer-follow')),
  )
}
