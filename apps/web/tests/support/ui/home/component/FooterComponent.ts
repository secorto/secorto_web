import { ui, type UILanguages } from '@i18n/ui'
import type { Page } from '@playwright/test'
import type { Target as TargetComponent } from '../../components/Target'
import { verifyStep } from '@tests/step'
import { target } from '../../components/Target'
import { image, type Image } from '../../components/Image'
import type { Loadable, LocalizedPage } from '@tests/support/ui/shared/contracts/localization'

export class FooterComponent implements Loadable, LocalizedPage<void> {
  constructor(
    readonly avatar: Image,
    readonly follow: TargetComponent,
  ) {}

  shouldBeLoaded() {
    return verifyStep('footer is loaded', async ({ expect }) => {
      await this.follow.shouldBeVisible(expect)
    })
  }

  shouldAvatarBeLoaded() {
    return verifyStep('footer avatar is loaded', async ({ expect }) => {
      await this.avatar.shouldBeLoaded().with(expect)
    })
  }

  shouldBeLocalized(locale: UILanguages) {
    return verifyStep('footer is localized correctly', async ({ expect }) => {
      const i18n = ui[locale]
      await this.follow.shouldHaveText(expect, i18n['footer.follow'])
      await this.avatar.shouldHaveText(expect, i18n['footer.logo_alt'])
    })
  }
}

export function footerPage(page: Page) {
  return new FooterComponent(
    image('footer logo', page.getByTestId('footer-logo')),
    target('footer follow', page.getByTestId('footer-follow')),
  )
}
