import type { Locator } from '@playwright/test'
import { createAssertions, type Should } from './assertions'

/**
 * Minimal Target interface: metadata only
 */
export interface Target {
  name: string
  locator: Locator
}

/**
 * TargetComponent: Target enriched with interaction & assertion methods
 */
export interface TargetComponent extends Target {
  click(): Promise<void>
  should: Should
  getAttribute(name: string): Promise<string | null>
}

export function target(name: string, locator: Locator) {
  return {
    name,
    locator,

    should: {
      ...createAssertions(name, (expect) => ({
        prefix: expect.name === 'expectFn' ? 'should softly' : 'should',
        chain: (msg: string) => expect(locator, msg),
      })),
      not: createAssertions(name, (expect) => ({
        prefix: expect.name === 'expectFn' ? 'should not softly' : 'should not',
        chain: (msg: string) => expect(locator, msg).not,
      })),
    } as const satisfies Should,

    async click() {
      await locator.click()
    },

    async getAttribute(attr: string): Promise<string | null> {
      return locator.getAttribute(attr)
    },
  } as const satisfies TargetComponent
}
