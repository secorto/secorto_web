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
    readonly role: TargetComponent,
    readonly follow: TargetComponent,
  ) {}

  shouldBeLoaded() {
    return verifyStep('footer is loaded', async ({ expect }) => {
      await this.role.shouldBeVisible().with(expect)
      await this.follow.shouldBeVisible().with(expect)
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
      await this.role.shouldHaveVisibleText(i18n['footer.role']).with(expect)
      await this.follow.shouldHaveVisibleText(i18n['footer.follow']).with(expect)
      await this.avatar.shouldHaveAttribute('alt', i18n['footer.avatar_alt']).with(expect)
    })
  }
}

export function footerPage(page: Page) {
  return new FooterComponent(
    image('footer avatar', page.getByTestId('footer-avatar')),
    target('footer role', page.getByTestId('footer-role')),
    target('footer follow', page.getByTestId('footer-follow')),
  )
}
