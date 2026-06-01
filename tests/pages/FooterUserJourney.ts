import type { Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { ui } from '@i18n/ui'
import { FooterPage, footerPage } from '@tests/pages/FooterPage'
import { visit } from '@tests/pages/UserJourneyFactory'

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

export const userInHomeWithFooter = (page: Page, locale: UILanguages) =>
  visit(
    `a user on home with footer in ${locale}`,
    page,
    `/${locale}/`,
    (p) => new FooterUserJourney(footerPage(p), locale),
  )
