import type { Locator } from '@playwright/test'
import { target, type TargetComponent } from './target'
import { step, type Step } from '@tests/step'
import type { ExpectLike } from '@tests/step'

export type Logo = TargetComponent & {
  shouldHaveCount: (expect: ExpectLike, count: number) => Step<void>
}

export function logo(name: string, locator: Locator): Logo {
  const base = target(name, locator)

  return {
    ...base,

    shouldHaveCount: (expect: ExpectLike, count: number) =>
      step(`${name} should have ${String(count)} nodes`, async () => {
        await expect(locator).toHaveCount(count)
      }),
  } satisfies Logo
}
