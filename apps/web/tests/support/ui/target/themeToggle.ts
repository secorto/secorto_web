import type { Locator } from '@playwright/test'
import { target, type TargetComponent } from './target'
import { step, verifyStep, type Step, type Verification } from '@tests/step'

export type ThemeToggle = TargetComponent & {
  getTransform: () => Step<string>
  shouldBeDifferent: (initialTransform: string) => Verification<void>
}

export function themeToggle(name: string, locator: Locator): ThemeToggle {
  const base = target(name, locator)
  const svgCircle = locator.locator('.theme-toggle__expand circle')

  return {
    ...base,

    getTransform: () =>
      step('get transform of theme toggle circle', async () => {
        return await svgCircle.evaluate((el: Element) => getComputedStyle(el).transform)
      }),

    shouldBeDifferent: (initialTransform: string) =>
      verifyStep('theme toggle icon transform should be changed', async ({ expect }) => {
        await expect.poll(async () => {
          return await svgCircle.evaluate((el: Element) => getComputedStyle(el).transform)
        }, { timeout: 2000, intervals: [100] }).not.toBe(initialTransform)
      }),
  } satisfies ThemeToggle
}
