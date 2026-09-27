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
 * .should is an assertion object that provides access to various assertions
 */
export interface TargetComponent extends Target {
  click(): Promise<void>
  should: Should
  getAttribute(name: string): Promise<string | null>
}

export function target(name: string, locator: Locator): TargetComponent {
  return {
    name,
    locator,

    should: {
      ...createAssertions(name, 'should', (expect) => expect(locator)),
      not: createAssertions(name, 'should not', (expect) => expect(locator).not),
    } satisfies Should,

    async click() {
      await locator.click()
    },

    async getAttribute(attr: string): Promise<string | null> {
      return locator.getAttribute(attr)
    },
  } satisfies TargetComponent
}
