import type { Locator } from '@playwright/test'
import { target, type TargetComponent } from './target'
import type { Should } from './assertions'
import { step, type Step } from '@tests/step'
import type { ExpectLike } from '@tests/step'

/**
 * Collection-specific assertions
 */
interface CollectionAssertions {
  haveAtLeastOne(expect: ExpectLike): Step<void>
}

function createCollectionAssertions(
  name: string,
  prefix: string,
  locator: Locator,
): CollectionAssertions {
  return {
    haveAtLeastOne: (expect: ExpectLike) =>
      step(`${name} ${prefix} have at least one item`, async () => {
        await expect.poll(async () => locator.count()).toBeGreaterThan(0)
      }),
  }
}

export type Collection = TargetComponent & {
  should: Should & CollectionAssertions
}

/**
 * Collection target for elements that represent multiple items.
 * Used for ul, div with children, lists, etc.
 * Extends base Target with polling assertion for item count.
 */
export function collection(name: string, locator: Locator): Collection {
  const base = target(name, locator)
  const collectionAssert = createCollectionAssertions(name, 'should', locator)

  return {
    ...base,
    should: {
      ...base.should,
      ...collectionAssert,
      not: {
        ...base.should.not,
      },
    } satisfies Should & CollectionAssertions,
  } satisfies Collection
}
