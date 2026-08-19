/**
 * A function that runs a named step, equivalent to test.step in Playwright.
 */
export type StepRunner = (
  title: string,
  action: () => unknown
) => Promise<unknown>

/**
 * A lazy step definition that can be inspected and executed.
 */
export interface Step<T> extends Promise<T> {
  title: string
  action: () => T | Promise<T>
}

/**
 * Creates a step builder bound to the given runner.
 *
 * @param runner - A function that executes a named step (e.g. test.step)
 * @param symbol - A string to identify the type of step (for debugging)
 * @returns A function that creates step definitions
 *
 * @example
 * ```ts
 * const step = makeStep(test.step, 'MyStep')
 * await step('click the button', () => page.click('button'))
 * ```
 */
export const makeStep =
  (runner: StepRunner, symbol: string) =>
  <T>(title: string, action: () => T | Promise<T>): Step<T> => {
    const run = () => runner(title, action) as Promise<T>

    return {
      title,
      action,
      then: (onFulfilled, onRejected) => run().then(onFulfilled, onRejected),
      catch: (onRejected) => run().catch(onRejected),
      finally: (onFinally) => run().finally(onFinally),
      [Symbol.toStringTag]: symbol
    }
  }
