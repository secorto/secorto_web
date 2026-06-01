import type { Locator } from '@playwright/test'
import { step } from '@tests/fixtures'

export class Target {
  constructor(
    readonly name: string,
    readonly locator: Locator,
  ) {}

  shouldBeVisible() {
    return step(`${this.name} should be visible`, async ({ expect }) => {
      await expect(this.locator).toBeVisible()
    })
  }

  shouldHaveText(textOrRegex: string | RegExp) {
    return step(`${this.name} should have text`, async ({ expect }) => {
      await expect(this.locator).toHaveText(textOrRegex)
    })
  }

  shouldContainText(textOrRegex: string | RegExp) {
    return step(`${this.name} should contain text`, async ({ expect }) => {
      await expect(this.locator).toContainText(textOrRegex)
    })
  }

  shouldHaveVisibleText(textOrRegex: string | RegExp) {
    return step(`${this.name} visible and has text`, async ({ expect }) => {
      await expect(this.locator).toBeVisible()
      await expect(this.locator).toHaveText(textOrRegex)
    })
  }

  shouldHaveClass(re: RegExp) {
    return step(`${this.name} should have class`, async ({ expect }) => {
      await expect(this.locator).toHaveClass(re)
    })
  }

  shouldHaveAttribute(name: string, value: string) {
    return step(`${this.name} should have attribute ${name}`, async ({ expect }) => {
      await expect(this.locator).toHaveAttribute(name, value)
    })
  }

  shouldHaveCount(count: number) {
    return step(`${this.name} should have count ${String(count)}`, async ({ expect }) => {
      await expect(this.locator).toHaveCount(count)
    })
  }

  click() {
    return step(`click ${this.name}`, async () => {
      await this.locator.click()
    })
  }
}

export function target(name: string, locator: Locator): Target
export function target(name: string, locator: Locator) {
  return new Target(name, locator)
}

export class TargetSelector<T> {
  constructor(readonly resolve: (value: T) => Locator) {}

  get(value: T) {
    return target(`target ${String(value)}`, this.resolve(value))
  }
}

export function targetSelector<T>(resolve: (value: T) => Locator) {
  return new TargetSelector(resolve)
}
