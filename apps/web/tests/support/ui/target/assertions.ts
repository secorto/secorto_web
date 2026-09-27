import { step, type Step } from '@tests/step'
import type { ExpectLike } from '@tests/step'

/**
 * ExpectChain interface: The assertion chain returned by expect()
 */
interface ExpectChain {
  toBeVisible(): Promise<void>
  toHaveText(textOrRegex: string | RegExp): Promise<void>
  toHaveClass(re: RegExp): Promise<void>
  toHaveAttribute(name: string, value: string): Promise<void>
}

/**
 * ShouldAssertions interface: Base assertion methods
 * Methods accept expect and return Step<void> for simple delegation
 */
export interface ShouldAssertions {
  beVisible(expect: ExpectLike): Step<void>
  haveText(expect: ExpectLike, textOrRegex: string | RegExp): Step<void>
  haveClass(expect: ExpectLike, re: RegExp): Step<void>
  haveAttribute(expect: ExpectLike, name: string, value: string): Step<void>
}

/**
 * ShouldNot interface: Negated assertions (same signature as ShouldAssertions)
 */
export type ShouldNot = ShouldAssertions

/**
 * Should interface: Positive assertions with negation chain
 */
export interface Should extends ShouldAssertions {
  not: ShouldNot
}

/**
 * Factory function to create assertion methods
 * Takes a prefix ("should" or "should not") and a function that returns the expect chain
 * This is declarative and DRY — avoids duplicating beVisible, haveText, etc.
 */
export function createAssertions(
  name: string,
  prefix: string,
  getExpectChain: (expect: ExpectLike) => ExpectChain,
): ShouldAssertions {
  return {
    beVisible: (expect: ExpectLike) =>
      step(`${name} ${prefix} be visible`, async () => {
        await getExpectChain(expect).toBeVisible()
      }),

    haveText: (expect: ExpectLike, textOrRegex: string | RegExp) =>
      step(`${name} ${prefix} have text ${textOrRegex}`, async () => {
        await getExpectChain(expect).toHaveText(textOrRegex)
      }),

    haveClass: (expect: ExpectLike, re: RegExp) =>
      step(`${name} ${prefix} have class ${re}`, async () => {
        await getExpectChain(expect).toHaveClass(re)
      }),

    haveAttribute: (expect: ExpectLike, attrName: string, value: string) =>
      step(`${name} ${prefix} have attribute ${attrName} with value ${value}`, async () => {
        await getExpectChain(expect).toHaveAttribute(attrName, value)
      }),
  }
}
