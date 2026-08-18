import type { Page } from '@playwright/test'
import { verifyStep } from '@tests/step'

export class PageHelper {
  constructor(readonly page: Page) {}

  shouldHaveURL(expected: string | RegExp) {
    return verifyStep(`page should have url ${expected}`, async ({ expect }) => {
      await expect(this.page).toHaveURL(expected)
    })
  }

  shouldHaveTitle(expected: RegExp = /SeCOrTo/) {
    return verifyStep(`page should have title ${expected}`, async ({ expect }) => {
      await expect(this.page).toHaveTitle(expected)
    })
  }
}

export function pageHelper(page: Page) {
  return new PageHelper(page)
}
