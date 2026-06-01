import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { ui } from '@i18n/ui'
import { FooterPage, footerPage } from '@tests/pages/footer/FooterPage'
import { userInHomeFactory } from '@tests/pages/shared/UserJourneyFactory'

export class FooterUserJourney {
  constructor(readonly footer: FooterPage, readonly locale: UILanguages) {}

  shouldHaveAvatarAlt() {
    return this.footer.shouldHaveAvatarAlt(ui[this.locale]['footer.avatar_alt'])
  }

  shouldHaveRoleText() {
    return this.footer.shouldHaveRoleText(ui[this.locale]['footer.role'])
  }

  shouldHaveFollowText() {
    return this.footer.shouldHaveFollowText(ui[this.locale]['footer.follow'])
  }
}

export const userInHome = (page: Page, locale: UILanguages) =>
  userInHomeFactory(
    `a user on home with footer in ${locale}`,
    page,
    locale,
    (p) => new FooterUserJourney(footerPage(p), locale),
  )
