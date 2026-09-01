import { verifyStep, step } from '@tests/step'
import { Target as TargetComponent } from '@tests/support/ui/components/Target'
import type { Locator } from '@playwright/test'

export class ThemeToggle extends TargetComponent {
  getTransform() {
    return step('get transform of theme toggle circle', async () => {
      const themeCircle = this.locator.locator('svg circle')
      return await themeCircle.evaluate((el: Element) => getComputedStyle(el).transform)
    })
  }

  shouldBeDifferent(initialTransform: string) {
    return verifyStep('theme toggle icon transform should be changed', async ({ expect }) => {
      const themeCircle = this.locator.locator('svg circle')
      await expect.poll(async () => {
        return await themeCircle.evaluate((el: Element) => getComputedStyle(el).transform)
      }, { timeout: 2000, intervals: [100] }).not.toBe(initialTransform)
    })
  }
}

export function themeToggle(name: string, locator: Locator) {
  return new ThemeToggle(name, locator)
}
