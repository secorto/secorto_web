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
 */
export interface ShouldAssertions {
  beVisible(expect: ExpectLike): Promise<void>
  haveText(expect: ExpectLike, textOrRegex: string | RegExp): Promise<void>
  haveClass(expect: ExpectLike, re: RegExp): Promise<void>
  haveAttribute(expect: ExpectLike, name: string, value: string): Promise<void>
}

/**
 * ShouldNot interface: Negated assertions (same methods as ShouldAssertions)
 */
export interface ShouldNot extends ShouldAssertions {}

/**
 * Should interface: Positive assertions with negation chain
 */
export interface Should extends ShouldAssertions {
  not: ShouldNot
}

/**
 * Factory function to create assertion methods with optional negation
 */
export function createAssertions(
  name: string,
  getPrefixAndChain: (expect: ExpectLike) => { prefix: string; chain: (msg: string) => ExpectChain },
): ShouldAssertions {
  return {
    async beVisible(expect: ExpectLike) {
      const { prefix, chain } = getPrefixAndChain(expect)
      return chain(`${name} ${prefix} be visible`).toBeVisible()
    },

    async haveText(expect: ExpectLike, textOrRegex: string | RegExp) {
      const { prefix, chain } = getPrefixAndChain(expect)
      return chain(`${name} ${prefix} have text ${textOrRegex}`).toHaveText(textOrRegex)
    },

    async haveClass(expect: ExpectLike, re: RegExp) {
      const { prefix, chain } = getPrefixAndChain(expect)
      return chain(`${name} ${prefix} have class ${re}`).toHaveClass(re)
    },

    async haveAttribute(expect: ExpectLike, attr: string, value: string) {
      const { prefix, chain } = getPrefixAndChain(expect)
      return chain(`${name} ${prefix} have attribute ${attr} with value ${value}`).toHaveAttribute(attr, value)
    },
  }
}
