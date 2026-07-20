import { test, expect } from '@playwright/test'

type ExpectType = typeof expect | typeof expect.soft
type StepExpect = { expect: ExpectType }

interface SoftableAssertion<T> extends Promise<T> {
  /**
   * Execute with a specific expect variant: hard or soft.
   * Use inside verifyStep to respect parent's mode.
   */
  with(expectFn: ExpectType): Promise<T>
  /**
   * Execute with soft expects: all failures are collected without early exit.
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
 * Returns SoftableAssertion with .with() for explicit expect variant and .soft() for grouped failures.
 * Only use when multiple independent assertions belong together in one verification.
 */
const verifyStepFn = <T>(
  title: string,
  action: (args: StepExpect) => T | Promise<T>
): SoftableAssertion<T> => {
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
    with: (expectFn: ExpectType) =>
      test.step(title, () => action({ expect: expectFn })),
    soft: () =>
      test.step(`${title} (soft)`, () => action({ expect: expect.soft }))
  } as SoftableAssertion<T>
}

export const verifyStep = verifyStepFn

export { test, expect }

