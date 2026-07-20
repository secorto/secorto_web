import type { UILanguages } from '@i18n/ui'
import type { Locator, Page } from '@playwright/test'
import { verifyStep } from '@tests/fixtures'
import { homePath, visit } from '@tests/support/ui/shared/NavigationPaths'

export class FooterPage {
  constructor(
    readonly page: Page,
    readonly avatar: Locator,
    readonly role: Locator,
    readonly follow: Locator,
  ) {}

  shouldHaveAvatarAlt(expectedAlt: string) {
    return verifyStep('footer avatar has localized alt text', async ({ expect }) => {
      await expect(this.avatar).toBeVisible()
      await expect(this.avatar).toHaveAttribute('alt', expectedAlt)
    })
  }

  shouldHaveRoleText(expectedRole: string) {
    return verifyStep('footer role text is localized', async ({ expect }) => {
      await expect(this.role).toBeVisible()
      await expect(this.role).toHaveText(expectedRole)
    })
  }

  shouldHaveFollowText(expectedFollow: string) {
    return verifyStep('footer follow label is localized', async ({ expect }) => {
      await expect(this.follow).toBeVisible()
      await expect(this.follow).toHaveText(expectedFollow)
    })
  }

  shouldHaveAvatarLoaded() {
    return verifyStep('footer avatar is present and loaded', async ({ expect }) => {
      await expect(this.avatar).toBeVisible()
      await expect(this.avatar).toHaveCount(1)

      await expect
        .poll(
          async () =>
            this.avatar.evaluate((img: HTMLImageElement) =>
              img.complete && img.naturalWidth > 0 ? img.naturalWidth : 0
            ),
          {
            message: 'Footer avatar image should be loaded',
            timeout: 10000,
          }
        )
        .toBeGreaterThan(0)
    })
  }
}

export function footerPage(page: Page) {
  return new FooterPage(
    page,
    page.getByTestId('footer-avatar'),
    page.getByTestId('footer-role'),
    page.getByTestId('footer-follow'),
  )
}

export const userInHome = (page: Page, locale: UILanguages) =>
  visit(`a user opening home in ${locale} for menu flow`, page, homePath(locale), footerPage)

