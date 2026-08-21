import { type Step } from './execution'

/**
 * Context passed into a verification action.
 */
export type VerifyContextOf<TExpect> = { expect: TExpect }

/**
 * A verification step that retains the base step contract and adds assertion
 * override helpers.
 */
export interface GenericVerification<T, TExpect> extends Step<T> {
  with(expectImpl: TExpect): Step<T>
  soft(): Step<T>
}

/**
 * Creates a verification-step factory for a given expect implementation set.
 *
 * @template TExpect - The assertion API exposed through the verification context.
 * @param defaultExpect - The default expect implementation used by generated steps.
 * @param softExpect - The replacement implementation used by the soft variant.
 * @param createStepWithContext - A factory function that accepts a title, action, and dynamic context.
 * @returns A function that builds a verification step from a title and action.
 */
export const createVerifyStep = <TExpect>(
  defaultExpect: TExpect,
  softExpect: TExpect,
  createStepWithContext: <TResult>(
    title: string,
    action: (ctx: VerifyContextOf<TExpect>) => TResult | Promise<TResult>,
    ctx: VerifyContextOf<TExpect>
  ) => Step<TResult>
) => {
  return <TResult>(
    title: string,
    action: (ctx: VerifyContextOf<TExpect>) => TResult | Promise<TResult>
  ): GenericVerification<TResult, TExpect> => {
    const base = createStepWithContext<TResult>(title, action, { expect: defaultExpect })

    return Object.assign(base, {

      with: (expectImpl: TExpect) =>
        createStepWithContext<TResult>(title, action, { expect: expectImpl }),

      soft: () =>
        createStepWithContext<TResult>(`${title} (soft)`, action, { expect: softExpect }),
    })
  }
}
