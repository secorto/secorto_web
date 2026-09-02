import type { Locator } from '@playwright/test'
import { verifyStep, type ExpectLike } from '@tests/step'

export class Target {
  constructor(
    readonly name: string,
    readonly locator: Locator,
  ) {}

  async shouldBeVisible(expect: ExpectLike) {
    await expect(this.locator, `${this.name} should be visible`).toBeVisible()
  }

  async shouldNotBeVisible(expect: ExpectLike) {
    await expect(this.locator, `${this.name} should not be visible`).not.toBeVisible()
  }

  async shouldHaveText(expect: ExpectLike, textOrRegex: string | RegExp) {
    await expect(this.locator, `${this.name} should have text ${textOrRegex}`).toHaveText(textOrRegex)
  }

  async shouldHaveClass(expect: ExpectLike, re: RegExp) {
    await expect(this.locator, `${this.name} should have class ${re}`).toHaveClass(re)
  }

  async shouldNotHaveClass(expect: ExpectLike, re: RegExp) {
    await expect(this.locator, `${this.name} should not have class ${re}`).not.toHaveClass(re)
  }

  async shouldHaveAttribute(expect: ExpectLike, name: string, value: string) {
    await expect(this.locator, `${this.name} should have attribute ${name} with value ${value}`).toHaveAttribute(name, value)
  }

  async shouldHaveCount(expect: ExpectLike, count: number) {
    await expect(this.locator, `${this.name} should have ${String(count)} nodes`).toHaveCount(count)
  }

  async click() {
    await this.locator.click()
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
