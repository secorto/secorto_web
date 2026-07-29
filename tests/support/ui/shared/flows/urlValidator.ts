import { verifyStep } from "@tests/fixtures"
import type { Page } from '@playwright/test'
import type { Verification } from '@tests/fixtures'

export function urlValidator(page: Page) {
  return function validateUrl(expected: string | RegExp): Verification<void> {
    return verifyStep(`url should match ${expected}`, async ({ expect }) => {
      await expect(page).toHaveURL(expected)
    })
  }
}
