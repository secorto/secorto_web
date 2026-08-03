import type { Locator } from '@playwright/test'
import { verifyStep, step } from '@tests/fixtures'

export class Target {
  constructor(
    readonly name: string,
    readonly locator: Locator,
  ) {}

  shouldBeVisible() {
    return verifyStep(`${this.name} should be visible`, async ({ expect }) => {
      await expect(this.locator).toBeVisible()
    })
  }

  shouldHaveText(textOrRegex: string | RegExp) {
    return verifyStep(`${this.name} should have text`, async ({ expect }) => {
      await expect(this.locator).toHaveText(textOrRegex)
    })
  }

  shouldContainText(textOrRegex: string | RegExp) {
    return verifyStep(`${this.name} should contain text`, async ({ expect }) => {
      await expect(this.locator).toContainText(textOrRegex)
    })
  }

  shouldHaveVisibleText(textOrRegex: string | RegExp) {
    return verifyStep(`${this.name} visible and has text`, async ({ expect }) => {
      await expect(this.locator).toBeVisible()
      await expect(this.locator).toHaveText(textOrRegex)
    })
  }

  shouldHaveClass(re: RegExp) {
    return verifyStep(`${this.name} should have class`, async ({ expect }) => {
      await expect(this.locator).toHaveClass(re)
    })
  }

  shouldHaveAttribute(name: string, value: string) {
    return verifyStep(`${this.name} should have attribute ${name} with value ${value}`, async ({ expect }) => {
      await expect(this.locator).toHaveAttribute(name, value)
    })
  }

  shouldHaveCount(count: number) {
    return verifyStep(`${this.name} should have count ${String(count)}`, async ({ expect }) => {
      await expect(this.locator).toHaveCount(count)
    })
  }

  click() {
    return step(`click ${this.name}`, async () => {
      await this.locator.click()
    })
  }

  /**
   * Get an attribute value from the element.
   * Used for reading data (not assertions).
   * Example: `const href = await target('link', el).getAttribute('href')`
   */
  async getAttribute(name: string): Promise<string | null> {
    return this.locator.getAttribute(name)
  }

  /**
   * Verify that there is at least one matching element.
   * Useful for lists or collections where count > 0 is expected.
   */
  shouldHaveAtLeastOne() {
    return verifyStep(`${this.name} should have at least one item`, async ({ expect }) => {
      await expect.poll(async () => this.locator.count()).toBeGreaterThan(0)
    })
  }
}

export function target(name: string, locator: Locator): Target {
  return new Target(name, locator)
}

export class TargetSelector<T> {
  constructor(
    readonly parent: string,
    readonly resolve: (value: T) => Locator,
    readonly valueLabel: (value: T) => string,
  ) {}

  get(value: T) {
    return target(`${this.parent} "${this.valueLabel(value)}"`, this.resolve(value))
  }
}

export function targetSelector<T>(
  parent: string,
  resolve: (value: T) => Locator,
  valueLabel: (value: T) => string = (value: T) => `"${String(value)}"`,
) {
  return new TargetSelector(parent, resolve, valueLabel)
}
