import { ui, type UILanguages } from '@i18n/ui'
import type { Page } from '@playwright/test'
import type { Target as TargetComponent } from '../../components/Target'
import { verifyStep } from '@tests/step'
import { target } from '../../components/Target'
import { image, type Image } from '../../components/Image'

export class FooterComponent {
  constructor(
    readonly avatar: Image,
    readonly role: TargetComponent,
    readonly follow: TargetComponent,
  ) {}

  shouldBeLoaded(locale: UILanguages) {
    return verifyStep('footer is loaded correctly', async ({ expect }) => {
      const i18n = ui[locale]
      await this.avatar.shouldBeLoaded().with(expect)
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
