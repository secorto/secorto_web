import type { Page } from '@playwright/test'
import type { VerifyStepFn } from '@secorto/step'

export class PageHelper {
  constructor(
    readonly page: Page,
    private verifyStep: VerifyStepFn,
  ) {}

  shouldHaveURL(expected: string | RegExp) {
    return this.verifyStep(`page should have url ${expected}`, async ({ expect }) => {
      await expect(this.page).toHaveURL(expected)
    })
  }

  shouldHaveTitle(expected: RegExp = /SeCOrTo/) {
    return this.verifyStep(`page should have title ${expected}`, async ({ expect }) => {
      await expect(this.page).toHaveTitle(expected)
    })
  }
}
