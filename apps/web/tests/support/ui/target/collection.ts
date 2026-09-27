import type { Locator } from '@playwright/test'
import { verifyStep, type Verification } from '@tests/step'
import { target } from './target'
import type { TargetComponent } from './target'

export interface Collection extends TargetComponent {
  shouldHaveAtLeastOne(): Verification<void>
}

/**
 * Collection target for elements that represent multiple items.
 * Used for ul, div with children, lists, etc.
 * Extends base Target with polling assertion for item count.
 */
export function collection(name: string, locator: Locator): Collection {
  return {
    ...target(name, locator),

    shouldHaveAtLeastOne() {
      return verifyStep(`${name} should have at least one item`, async ({ expect }) => {
        await expect.poll(async () => locator.count()).toBeGreaterThan(0)
      })
    },
  } as const satisfies Collection
}
