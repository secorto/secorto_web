import type { Locator } from '@playwright/test'
import { type ExpectLike } from '@tests/step'

/**
 * Minimal Target interface: metadata only
 */
export interface Target {
  name: string
  locator: Locator
}

/**
 * TargetComponent: Target enriched with interaction & assertion methods
 */
export interface TargetComponent extends Target {
  click(): Promise<void>
  shouldBeVisible(expect: ExpectLike): Promise<void>
  shouldNotBeVisible(expect: ExpectLike): Promise<void>
  shouldHaveText(expect: ExpectLike, textOrRegex: string | RegExp): Promise<void>
  shouldHaveClass(expect: ExpectLike, re: RegExp): Promise<void>
  shouldNotHaveClass(expect: ExpectLike, re: RegExp): Promise<void>
  shouldHaveAttribute(expect: ExpectLike, name: string, value: string): Promise<void>
  getAttribute(name: string): Promise<string | null>
}

export function target(name: string, locator: Locator) {
  return {
    name,
    locator,

    async shouldBeVisible(expect: ExpectLike) {
      await expect(locator, `${name} should be visible`).toBeVisible()
    },

    async shouldNotBeVisible(expect: ExpectLike) {
      await expect(locator, `${name} should not be visible`).not.toBeVisible()
    },

    async shouldHaveText(expect: ExpectLike, textOrRegex: string | RegExp) {
      await expect(locator, `${name} should have text ${textOrRegex}`).toHaveText(textOrRegex)
    },

    async shouldHaveClass(expect: ExpectLike, re: RegExp) {
      await expect(locator, `${name} should have class ${re}`).toHaveClass(re)
    },

    async shouldNotHaveClass(expect: ExpectLike, re: RegExp) {
      await expect(locator, `${name} should not have class ${re}`).not.toHaveClass(re)
    },

    async shouldHaveAttribute(expect: ExpectLike, attr: string, value: string) {
      await expect(locator, `${name} should have attribute ${attr} with value ${value}`).toHaveAttribute(attr, value)
    },

    async click() {
      await locator.click()
    },

    async getAttribute(attr: string): Promise<string | null> {
      return locator.getAttribute(attr)
    },
  } as const satisfies TargetComponent
}
