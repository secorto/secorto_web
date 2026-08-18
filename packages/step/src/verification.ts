import type { StepRunner } from './step.ts'

/**
 * A lazy contextable step definition that can be inspected and executed.
 * The `.with(context)` method allows overriding the context for a specific run.
 */
export interface ContextableStep<T, TContext extends object> extends Promise<T> {
  title: string
  action: (context: TContext) => T | Promise<T>
  /**
   * Execute this step with a different context (e.g. a different expect variant).
   */
  with(context: Partial<TContext>): ContextableStep<T, TContext>
}

/**
 * Creates a verification step builder bound to the given runner and initial context.
 *
 * @param runner - A function that executes a named step (e.g. test.step)
 * @param context - The initial context injected into the action (e.g. { expect })
 * @returns A function that creates contextable step definitions
 *
 * @example
 * ```ts
 * const verifyStep = makeVerification(test.step, { expect })
 * await verifyStep('page title is correct', ({ expect }) => {
 *   expect(page.title()).toBe('Home')
 * })
 * // Override context for a soft assertion:
 * await verifyStep('...', ({ expect }) => { ... }).with({ expect: expect.soft })
 * ```
 */
export const makeVerification =
  <TContext extends object>(runner: StepRunner, context: TContext) =>
    <T>(
      title: string,
      action: (context: TContext) => T | Promise<T>
    ): ContextableStep<T, TContext> => {
      let activeContext = context

      const run = () => runner(title, () => action(activeContext)) as Promise<T>

      const step: ContextableStep<T, TContext> = {
        title,
        action,

        then: (onFulfilled, onRejected) => run().then(onFulfilled, onRejected),
        catch: (onRejected) => run().catch(onRejected),
        finally: (onFinally) => run().finally(onFinally),

        with(newContext: Partial<TContext>): ContextableStep<T, TContext> {
          activeContext = { ...activeContext, ...newContext }
          return step
        },
      } as ContextableStep<T, TContext>

      return step
    }
