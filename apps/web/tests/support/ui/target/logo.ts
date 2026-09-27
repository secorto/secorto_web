import type { Locator } from '@playwright/test'
import { target, type TargetComponent } from './target'
import type { ExpectLike } from '@tests/step'

export type Logo = TargetComponent & {
  shouldHaveCount: (expect: ExpectLike, count: number) => Promise<void>
}

export function logo(name: string, locator: Locator): Logo {
  const base = target(name, locator)

  return {
    ...base,

    async shouldHaveCount(expect: ExpectLike, count: number) {
      await expect(locator, `${name} should have ${String(count)} nodes`).toHaveCount(count)
    },
  } satisfies Logo
}
