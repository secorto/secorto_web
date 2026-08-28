import type { Locator } from '@playwright/test'
import type { VerifyStepFn } from '@secorto/step'
import { Target } from './Target'

export class Image extends Target {
  shouldBeLoaded() {
    return this['verifyStep'](`${this.name} is present and loaded`, async ({ expect }) => {
      await this.locator.scrollIntoViewIfNeeded()
      await expect(this.locator).toBeVisible()
      await expect(this.locator).toHaveCount(1)

      await expect
        .poll(
          async () =>
            this.locator.evaluate((img: HTMLImageElement) =>
              img.complete && img.naturalWidth > 0 ? img.naturalWidth : 0
            ),
          {
            message: `${this.name} image should be loaded`,
            timeout: 10000,
          }
        )
        .toBeGreaterThan(0)
    })
  }
}
