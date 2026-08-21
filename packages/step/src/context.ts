import { createStep, type Step, type StepRunner } from "./execution"


/**
 * Builds a lazy step from a title, an action, and a fixed context value.
 *
 * The returned function is a convenience factory for step definitions that need
 * the same context object on every execution.
 */
export type StepBuilder<TContext> = <TResult>(
  title: string,
  action: (ctx: TContext) => TResult | Promise<TResult>,
  ctx: TContext
) => Step<TResult>


/**
 * Creates a step builder that injects a fixed context value into each action.
 *
 * The returned builder wraps the underlying step factory and closes over `ctx`,
 * so the generated steps invoke `action(ctx)` when executed.
 *
 * @template TContext - The shared context passed to every generated step.
 * @param runner - The step executor used by the resulting steps.
 * @param symbol - Optional debug label for the generated step objects.
 * @returns A function that creates a step with the supplied context bound in.
 */
export const createContextStep =
  <TContext>(runner: StepRunner, symbol = 'StepContext'): StepBuilder<TContext> =>
  <T>(
    title: string,
    action: (ctx: TContext) => T | Promise<T>,
    ctx: TContext
  ): Step<T> => {
    const step = createStep(runner, symbol)
    return step<T>(title, () => action(ctx))
  }
