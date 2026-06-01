import type { Locator, Page } from '@playwright/test'
import { step } from '@tests/fixtures'

export class FooterPage {
  constructor(
    readonly page: Page,
    readonly avatar: Locator,
    readonly role: Locator,
    readonly follow: Locator,
  ) {}

  shouldHaveAvatarAlt(expectedAlt: string) {
    return step('footer avatar has localized alt text', async ({ expect }) => {
      await expect(this.avatar).toBeVisible()
      await expect(this.avatar).toHaveAttribute('alt', expectedAlt)
    })
  }

  shouldHaveRoleText(expectedRole: string) {
    return step('footer role text is localized', async ({ expect }) => {
      await expect(this.role).toBeVisible()
      await expect(this.role).toHaveText(expectedRole)
    })
  }

  shouldHaveFollowText(expectedFollow: string) {
    return step('footer follow label is localized', async ({ expect }) => {
      await expect(this.follow).toBeVisible()
      await expect(this.follow).toHaveText(expectedFollow)
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
