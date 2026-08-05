import { verifyStep, type Verification } from '@tests/step'
import type { Page } from '@playwright/test'

export function urlValidator(page: Page) {
  return function validateUrl(expected: string | RegExp): Verification<void> {
    return verifyStep(`url should match ${expected}`, async ({ expect }) => {
      await expect(page).toHaveURL(expected)
    })
  }
}
