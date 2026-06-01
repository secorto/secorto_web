import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { ui } from '@i18n/ui'
import { step } from '@tests/fixtures'
import { FooterPage } from '@tests/pages/FooterPage'
import { visit } from '@tests/pages/UserJourneyFactory'

export class FooterUserJourney {
  constructor(readonly footer: FooterPage, readonly locale: UILanguages) {}

  shouldHaveAvatarAlt() {
    return step('footer avatar has localized alt text', async ({ expect }) => {
      await expect(this.footer.avatar()).toBeVisible()
      await expect(this.footer.avatar()).toHaveAttribute('alt', ui[this.locale]['footer.avatar_alt'])
    })
  }

  shouldHaveRoleText() {
    return step('footer role text is localized', async ({ expect }) => {
      await expect(this.footer.role()).toBeVisible()
      await expect(this.footer.role()).toHaveText(ui[this.locale]['footer.role'])
    })
  }

  shouldHaveFollowText() {
    return step('footer follow label is localized', async ({ expect }) => {
      await expect(this.footer.follow()).toBeVisible()
      await expect(this.footer.follow()).toHaveText(ui[this.locale]['footer.follow'])
    })
  }
}

export const userInHomeWithFooter = (page: Page, locale: UILanguages) =>
  visit(
    `a user on home with footer in ${locale}`,
    page,
    `/${locale}/`,
    (p) => new FooterUserJourney(new FooterPage(p), locale),
  )
