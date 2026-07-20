import { test, expect } from '@playwright/test'

type StepExpect = { expect: typeof expect.soft }

interface VerifyStepThenable<T> extends Promise<T> {
  /**
   * Execute assertions with soft expects: all failures are collected and reported together,
   * without exiting early. Only use for assertions that are truly independent and softable
   * (e.g., visibility checks, text matches).
   */
  soft(): Promise<T>
}

/**
 * Wrap action steps (navigation, clicks, state changes).
 * Does not inject expect; use for orchestration logic only.
 */
export const step = <T>(
  title: string,
  action: () => T | Promise<T>
) => test.step(title, action)

/**
 * Wrap assertion/verification steps that support soft expects.
 * Returns VerifyStepThenable with .soft() method for grouped failures.
 * Only use when multiple independent assertions belong together in one verification.
 */
const verifyStepFn = <T>(
  title: string,
  action: (args: StepExpect) => T | Promise<T>
): VerifyStepThenable<T> => {
  return {
    then: <TResult1 = T, TResult2 = never>(
      onFulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined,
      onRejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null | undefined
    ) =>
      test.step(title, () => action({ expect })).then(onFulfilled, onRejected),
    catch: <TResult = never>(
      onRejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null | undefined
    ) =>
      test.step(title, () => action({ expect })).catch(onRejected),
    finally: (onFinally?: () => void | PromiseLike<void>) =>
      test.step(title, () => action({ expect })).finally(onFinally),
    soft: () =>
      test.step(`${title} (soft)`, () => action({ expect: expect.soft }))
  } as VerifyStepThenable<T>
}

export const verifyStep = verifyStepFn

export { test, expect }
