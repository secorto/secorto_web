/**
 * Executes a named step in the host test framework and resolves to the action's
 * result.
 *
 * The implementation is expected to provide the step title and call the supplied
 * function under that step boundary.
 */
export type StepRunner = <T>(
  title: string,
  action: () => T | Promise<T>
) => Promise<T>

/**
 * A lazy step definition that keeps the step metadata alongside a Promise-like
 * execution contract.
 *
 * The object can be inspected before execution and awaited as a normal promise.
 * When awaited, it runs the underlying step through the configured runner.
 */
export interface Step<T> extends PromiseLike<T> {
  title: string
  action: () => T | Promise<T>
  readonly [Symbol.toStringTag]: string
}

/**
 * Creates a reusable step factory backed by a specific runner.
 *
 * Each generated step stores its title and action, then executes them through
 * the supplied runner when the step is awaited or otherwise resolved.
 *
 * @param runner - The function responsible for executing a named step and
 * returning its result.
 * @param symbol - A debug label used as the step's string tag.
 * @returns A function that creates a lazy step definition from a title and
 * action.
 */
export const createStep =
  (runner: StepRunner, symbol: string) =>
  <T>(title: string, action: () => T | Promise<T>): Step<T> => {
    const run = () => runner(title, action)

    return {
      title,
      action,
      then: (onFulfilled, onRejected) => run().then(onFulfilled, onRejected),
      [Symbol.toStringTag]: symbol
    }
  }
