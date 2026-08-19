/**
 * A function that runs a named step, equivalent to test.step in Playwright.
 */
export type StepRunner = <T>(
  title: string,
  action: () => T | Promise<T>
) => Promise<T>

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
    const run = () => runner(title, action)

    return {
      title,
      action,
      then: (onFulfilled, onRejected) => run().then(onFulfilled, onRejected),
      catch: (onRejected) => run().catch(onRejected),
      finally: (onFinally) => run().finally(onFinally),
      [Symbol.toStringTag]: symbol
    }
  }

/**
 * Creates a step builder that injects a fixed context object into each action.
 *
 * This keeps the step abstraction framework-agnostic while allowing adapters
 * such as Playwright to provide their own context payloads (for example,
 * `{ expect }`).
 */
export const createContextStep =
  <TContext>(runner: StepRunner, symbol = 'StepContext') =>
  <T>(
    title: string,
    action: (ctx: TContext) => T | Promise<T>,
    ctx: TContext
  ): Step<T> => {
    const step = makeStep(runner, symbol)
    return step<T>(title, () => action(ctx))
  }
