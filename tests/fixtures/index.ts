import { test, expect } from '@playwright/test'

export interface Step<T> extends Promise<T> {
  kind: 'action'
}

/**
 * Defines a step
 * @param title Title of the step
 * @param action Action to be executed
 * @returns Return value of the action
 */
export const step = <T>(
  title: string,
  action: () => T | Promise<T>
): Step<T> => {
  const run = () => test.step(title, action)

  return {
    kind: 'action',

    then: (onFulfilled, onRejected) => run().then(onFulfilled, onRejected),
    catch: (onRejected) => run().catch(onRejected),
    finally: (onFinally) => run().finally(onFinally)
  } as Step<T>
}


type ExpectType = typeof expect | typeof expect.soft
type StepExpect = { expect: ExpectType }

export interface Verification<T> extends Promise<T> {
  kind: 'verification'
  expect: ExpectType
  /**
   * Execute with a specific expect variant: hard or soft.
   * Use inside verifyStep to respect parent's mode.
   */
  with(expectFn: ExpectType): Verification<T>
  /**
   * Execute with soft expects: all failures are collected without early exit.
   */
  soft(): Verification<T>
}

const buildVerification = <T>(
  title: string,
  action: (args: StepExpect) => T | Promise<T>,
  expectFn: ExpectType
): Verification<T> => {

  const run = () =>
    test.step(
      expectFn === expect.soft ? `${title} (soft)` : title,
      () => action({ expect: expectFn })
    )

  return {
    kind: 'verification',
    expect: expectFn,

    then: (onFulfilled, onRejected) => run().then(onFulfilled, onRejected),
    catch: (onRejected) => run().catch(onRejected),
    finally: (onFinally) => run().finally(onFinally),

    soft() {
      return buildVerification(`${title} (soft)`, action, expect.soft)
    },

    with(newExpect) {
      return buildVerification(title, action, newExpect)
    }
  } as Verification<T>
}

/**
 * Defines a verification step that can be executed with hard or soft expects.
 * @param title Title of verification
 * @param action Verification to be executed
 * @returns value of the action parameter
 */
export const verifyStep = <T>(
  title: string,
  action: (args: StepExpect) => T | Promise<T>
): Verification<T> => buildVerification(title, action, expect)

export { test, expect }
