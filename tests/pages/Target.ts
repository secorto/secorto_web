import type { Locator } from '@playwright/test'
import { step } from '@tests/fixtures'

export class Target {
  constructor(readonly locator: Locator) {}

  shouldBeVisible() {
    return step('target should be visible', async ({ expect }) => {
      await expect(this.locator).toBeVisible()
    })
  }

  shouldHaveText(textOrRegex: string | RegExp) {
    return step('target should have text', async ({ expect }) => {
      await expect(this.locator).toHaveText(textOrRegex)
    })
  }

  shouldHaveClass(re: RegExp) {
    return step('target should have class', async ({ expect }) => {
      await expect(this.locator).toHaveClass(re)
    })
  }
}

export function target(locator: Locator) {
  return new Target(locator)
}
