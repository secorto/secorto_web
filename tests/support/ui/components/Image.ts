import { verifyStep } from "@tests/fixtures"
import { Target } from "./Target"
import type { Locator } from '@playwright/test'

export class Image extends Target {

  shouldBeLoaded() {
    return verifyStep(`${this.name} is present and loaded`, async ({ expect }) => {
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

export function image(name: string, locator: Locator) {
  return new Image(name, locator)
}
