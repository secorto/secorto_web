import type { Locator } from '@playwright/test'
import { target, type TargetComponent } from './target'
import { verifyStep, type Verification } from '@tests/step'

export type Image = TargetComponent & {
  shouldBeLoaded: () => Verification<void>
}

export function image(name: string, locator: Locator): Image {
  const base = target(name, locator)

  return {
    ...base,

    shouldBeLoaded: () =>
      verifyStep(`${name} is present and loaded`, async ({ expect }) => {
        await locator.scrollIntoViewIfNeeded()
        await expect(locator).toBeVisible()
        await expect(locator).toHaveCount(1)

        await expect
          .poll(
            async () =>
              locator.evaluate((img: HTMLImageElement) =>
                img.complete && img.naturalWidth > 0 ? img.naturalWidth : 0
              ),
            {
              message: `${name} image should be loaded`,
              timeout: 10000,
            }
          )
          .toBeGreaterThan(0)
      }),
  } satisfies Image
}
