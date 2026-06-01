import { step } from '@tests/fixtures'
import { target } from '@tests/pages/components/Target'
import type { Target as TargetComponent } from '@tests/pages/components/Target'
import type { Page } from '@playwright/test'

export class ThemeToggle {
  constructor(readonly toggle: TargetComponent) {}

  shouldBeVisible() {
    return this.toggle.shouldBeVisible()
  }

  toggleTheme() {
    return this.toggle.click()
  }

  getTransform() {
    return step('get transform of theme toggle circle', async () => {
      const themeCircle = this.toggle.locator.locator('svg circle')
      return await themeCircle.evaluate((el: Element) => getComputedStyle(el).transform)
    })
  }

  shouldBeDifferent(initialTransform: string) {
    return step('theme toggle icon transform should be changed', async ({ expect }) => {
      const themeCircle = this.toggle.locator.locator('svg circle')
      await expect.poll(async () => {
        return await themeCircle.evaluate((el: Element) => getComputedStyle(el).transform)
      }, { timeout: 2000, intervals: [100] }).not.toBe(initialTransform)
    })
  }
}

export function themeToggleFromTarget(locator: import('@playwright/test').Locator) {
  return new ThemeToggle(target(locator))
}

export function themeToggleFromPage(page: Page) {
  return themeToggleFromTarget(page.getByTestId('theme-toggle'))
}
