import type { Step, StepRunner } from './step'
import { createContextStep, makeStep } from './step'

/**
 * Context object injected into a verification action.
 *
 * The caller decides the concrete testing framework adapter, so the
 * `expect` property is inferred from the actual injected implementation.
 */
export type VerifyContextOf<TExpect> = { expect: TExpect }

/**
 * Builds a concrete verification step for a given expect implementation.
 *
 * This is intentionally framework-agnostic: the caller provides the
 * actual adapter that wraps the real assertion engine.
 */
export type StepBuilder<TExpect> = <TResult>(
  title: string,
  action: (ctx: VerifyContextOf<TExpect>) => TResult | Promise<TResult>,
  expectImpl: TExpect
) => Step<TResult>

/**
 * A verification step that can override the assertion implementation.
 */
export interface Verification<T, TExpect> extends Step<T> {
  with(expectImpl: TExpect): Step<T>
  soft(): Step<T>
}

/**
 * Creates a framework-agnostic verification adapter.
 *
 * The caller supplies the runner, the default expect implementation,
 * and the soft variant. By default, the action is wrapped in a fixed
 * `{ expect }` context and executed via the runner.
 */
export const createTestingStep = <TExpect>(
  runner: StepRunner,
  defaultExpect: TExpect,
  softExpect: TExpect,
  buildStep: StepBuilder<TExpect> = <TResult>(
    title: string,
    action: (ctx: VerifyContextOf<TExpect>) => TResult | Promise<TResult>,
    expectImpl: TExpect
  ) =>
    createContextStep<VerifyContextOf<TExpect>>(runner, 'StepVerification')<
      TResult
    >(title, action, { expect: expectImpl })
) => {
  return {
    step: makeStep(runner, 'StepAction'),
    verifyStep: <TResult>(
      title: string,
      action: (ctx: VerifyContextOf<TExpect>) => TResult | Promise<TResult>
    ): Verification<TResult, TExpect> => {
      const base = buildStep<TResult>(title, action, defaultExpect)

      return {
        ...base,
        with: (expectImpl: TExpect) =>
          buildStep<TResult>(title, action, expectImpl),
        soft: () =>
          buildStep<TResult>(`${title} (soft)`, action, softExpect),
      }
    },
  }
}
