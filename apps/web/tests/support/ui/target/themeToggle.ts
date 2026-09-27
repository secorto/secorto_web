import type { Locator } from '@playwright/test'
import { target, type TargetComponent } from './target'
import { step, verifyStep, type Step, type Verification } from '@tests/step'

export type ThemeToggle = TargetComponent & {
  getTransform: () => Step<string>
  shouldBeDifferent: (initialTransform: string) => Verification<void>
}

export function themeToggle(name: string, locator: Locator): ThemeToggle {
  const base = target(name, locator)

  return {
    ...base,

    getTransform: () =>
      step('get transform of theme toggle circle', async () => {
        const themeCircle = locator.locator('svg circle')
        return await themeCircle.evaluate((el: Element) => getComputedStyle(el).transform)
      }),

    shouldBeDifferent: (initialTransform: string) =>
      verifyStep('theme toggle icon transform should be changed', async ({ expect }) => {
        const themeCircle = locator.locator('svg circle')
        await expect.poll(async () => {
          return await themeCircle.evaluate((el: Element) => getComputedStyle(el).transform)
        }, { timeout: 2000, intervals: [100] }).not.toBe(initialTransform)
      }),
  } satisfies ThemeToggle
}
