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
export interface GenericVerification<T, TExpect> extends Step<T> {
  with(expectImpl: TExpect): Step<T>
  soft(): Step<T>
}

/**
 * Creates a verification step factory bound to a specific runner and expect
 * implementation.
 *
 * The returned function mirrors the `test.step` calling convention, but injects
 * the assertion object into the action context as `{ expect }`. This keeps the
 * step semantics stable while allowing the caller to swap between strict and
 * soft expectations without changing the test body.
 *
 * @typeParam TExpect - The assertion implementation type, for example `typeof expect`
 * or `typeof expect.soft`.
 * @param runner - The underlying step runner, typically `test.step`.
 * @param defaultExpect - The default assertion implementation used by the step.
 * @param softExpect - The soft assertion implementation used by `.soft()`.
 * @param buildStep - Optional custom step builder used to adapt the context shape
 * for a specific framework or testing harness.
 * @returns A function that creates a named verification step from a title and action.
 *
 * @example
 * ```ts
 * const verifyStep = makeVerifyStep(test.step, expect, expect.soft)
 *
 * await verifyStep('the form is submitted', ({ expect }) => {
 *   expect(page.getByRole('button', { name: 'Enviar' })).toBeVisible()
 * })
 * ```
 */
export const makeVerifyStep = <TExpect>(
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
  return <TResult>(
    title: string,
    action: (ctx: VerifyContextOf<TExpect>) => TResult | Promise<TResult>
  ): GenericVerification<TResult, TExpect> => {
    const base = buildStep<TResult>(title, action, defaultExpect)

    return {
      ...base,
      with: (expectImpl: TExpect) => buildStep<TResult>(title, action, expectImpl),
      soft: () => buildStep<TResult>(`${title} (soft)`, action, softExpect),
    }
  }
}

/**
 * Creates the standard testing adapter used across the project.
 *
 * It exposes a plain `step` runner plus a verification helper that receives a
 * `{ expect }` context and supports `.with(...)` and `.soft()` overrides.
 *
 * @typeParam TExpect - Assertion implementation used by the verification step.
 * @param runner - Step runner used to execute the named action.
 * @param defaultExpect - Default assertion implementation for strict checks.
 * @param softExpect - Assertion implementation used by the soft variant.
 * @param buildStep - Optional custom builder when a different step wrapper is needed.
 * @returns An object with the adapters `step` and `verifyStep` helpers.
 */
export const createTestingStep = <TExpect>(
  runner: StepRunner,
  defaultExpect: TExpect,
  softExpect: TExpect,
  buildStep?: StepBuilder<TExpect>
) => {
  return {
    step: makeStep(runner, 'StepAction'),
    verifyStep: makeVerifyStep(runner, defaultExpect, softExpect, buildStep),
  }
}
