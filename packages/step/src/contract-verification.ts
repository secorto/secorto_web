import { createContextStep } from './context'
import { StepRunner, type Step } from './execution'
import { GenericVerification } from './verification'

/**
 * Context passed into a verification action.
 */
export type VerifyContextOf<TExpect> = { expect: TExpect }

/**
 * A verification step that retains the base step contract and adds assertion
 * override helpers.
 */
export interface GenericContractVerification<TRaw, TResult, TExpect> extends GenericVerification<TResult, TExpect> {
  title: string
  originFn: () => TRaw | Promise<TRaw>
  verifyFn: (raw: TRaw, ctx: VerifyContextOf<TExpect>) => TResult | Promise<TResult>
  raw: () => Promise<TRaw>
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
export const createContractVerifyStep = <TExpect>(
  runner: StepRunner,
  defaultExpect: TExpect,
  softExpect: TExpect,
  symbol = 'ContractVerifyStep'
) => {
  const buildContextStep = createContextStep<VerifyContextOf<TExpect>>(runner, symbol)

  return <TRaw, TResult>(
    title: string,
    originFn: () => TRaw | Promise<TRaw>,
    verifyFn: (raw: TRaw, ctx: VerifyContextOf<TExpect>) => TResult | Promise<TResult>
  ): GenericContractVerification<TRaw, TResult, TExpect> => {

    // Orquestador perezoso que une las dos funciones en secuencia
    const createPipelineAction = (expectInstance: TExpect) => {
      return async () => {
        const raw = await originFn()
        return verifyFn(raw, { expect: expectInstance })
      }
    }

    const baseStep = buildContextStep<TResult>(
      title,
      createPipelineAction(defaultExpect),
      { expect: defaultExpect }
    )

    const runRaw = () => runner(`${title} (raw)`, originFn)

    return Object.assign(baseStep, {
      title,
      originFn,
      verifyFn,
      raw: runRaw,

      with: (expectImpl: TExpect) =>
        buildContextStep<TResult>(title, createPipelineAction(expectImpl), { expect: expectImpl }),

      soft: () =>
        buildContextStep<TResult>(`${title} (soft)`, createPipelineAction(softExpect), { expect: softExpect })
    })
  }
}
