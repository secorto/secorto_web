import { test, expect } from '@playwright/test'
import { makeStep } from '@secorto/step'
import type { Step } from '@secorto/step'

export type { Step } from '@secorto/step'

type VerifyContext = { expect: typeof expect }

/**
 * A basic verification step that injects the Playwright expect function.
 */
export interface Verification<T> extends Step<T> {
  with(expectImpl: typeof expect): Step<T>
  soft(): Step<T>
}

/**
 * Defines a plain action step.
 * @param title Title of the step
 * @param action Action to be executed
 * @returns Return value of the action
 */
export const step = makeStep(test.step)

/**
 * Defines a verification step that can be executed with hard or soft expects.
 * @param title Title of verification
 * @param action Verification to be executed
 * @returns a fresh step with the selected expect implementation
 */
export const verifyStep = <T>(
  title: string,
  action: (ctx: VerifyContext) => T | Promise<T>
): Verification<T> => {
  const build = (expectImpl: typeof expect): Step<T> =>
    makeStep(test.step)(title, () => action({ expect: expectImpl }))

  const base = build(expect)

  return {
    ...base,
    with: (expectImpl: typeof expect) => build(expectImpl),
    soft: () => build(expect.soft),
  }
}
