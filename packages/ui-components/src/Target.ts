import type { Locator } from '@playwright/test'
import type { StepFn, VerifyStepFn } from '@secorto/step'

export class Target {
  constructor(
    readonly name: string,
    readonly locator: Locator,
    private step: StepFn,
    private verifyStep: VerifyStepFn,
  ) {}

  shouldBeVisible() {
    return this.verifyStep(`${this.name} should be visible`, async ({ expect }) => {
      await expect(this.locator).toBeVisible()
    })
  }

  shouldHaveText(textOrRegex: string | RegExp) {
    return this.verifyStep(`${this.name} should have text`, async ({ expect }) => {
      await expect(this.locator).toHaveText(textOrRegex)
    })
  }

  shouldContainText(textOrRegex: string | RegExp) {
    return this.verifyStep(`${this.name} should contain text`, async ({ expect }) => {
      await expect(this.locator).toContainText(textOrRegex)
    })
  }

  shouldHaveVisibleText(textOrRegex: string | RegExp) {
    return this.verifyStep(`${this.name} visible and has text`, async ({ expect }) => {
      await expect(this.locator).toBeVisible()
      await expect(this.locator).toHaveText(textOrRegex)
    })
  }

  shouldHaveClass(re: RegExp) {
    return this.verifyStep(`${this.name} should have class`, async ({ expect }) => {
      await expect(this.locator).toHaveClass(re)
    })
  }

  shouldHaveAttribute(name: string, value: string) {
    return this.verifyStep(`${this.name} should have attribute ${name} with value ${value}`, async ({ expect }) => {
      await expect(this.locator).toHaveAttribute(name, value)
    })
  }

  shouldHaveCount(count: number) {
    return this.verifyStep(`${this.name} should have count ${String(count)}`, async ({ expect }) => {
      await expect(this.locator).toHaveCount(count)
    })
  }

  click() {
    return this.step(`click ${this.name}`, async () => {
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
    return this.verifyStep(`${this.name} should have at least one item`, async ({ expect }) => {
      await expect.poll(async () => this.locator.count()).toBeGreaterThan(0)
    })
  }
}
