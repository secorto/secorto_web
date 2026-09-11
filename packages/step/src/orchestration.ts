import type { StepRunner } from './execution'
import type { GenericVerification, VerifyContextOf } from './verification'
import type { ResourceStep } from './resource'
import { createContextStep } from './context'

/**
 * A fully composed orchestration step that unifies the two structural domains:
 *
 *   - ResourceStep<TRaw, TResult>  — two-phase execution (originFn → transformFn) with `.raw()`
 *   - GenericVerification<TResult, TExpect> — assertion strategy control with `.soft()` / `.with()`
 *
 * The structural relationship is precise:
 *   orchestrateStep IS a resourceStep where transformFn = (raw) => verifyFn(raw, { expect })
 *
 * `verifyFn` is the open form of `transformFn` — the user-supplied logic with the
 * assertion context (`{ expect }`) injected as its second argument. The closed form
 * (bound to a specific expect instance) is what the inherited `transformFn` slot holds
 * at any given execution boundary.
 *
 * `.with(expect)` and `.soft()` swap which expect instance is closed over,
 * producing a new immutable step with a different `transformFn` binding.
 */
export interface GenericOrchestrateStep<TRaw, TResult, TExpect>
  extends ResourceStep<TRaw, TResult>,
          GenericVerification<TResult, TExpect> {
  /**
   * The open-form transform: the user-supplied logic before context injection.
   * Relation: transformFn = (raw) => verifyFn(raw, { expect: currentExpect })
   */
  verifyFn: (raw: TRaw, ctx: VerifyContextOf<TExpect>) => TResult | Promise<TResult>
}

/**
 * Creates an orchestrate-step factory for a given runner and assertion set.
 *
 * Each generated orchestrate step stores its title, originFn, and verifyFn,
 * then executes them through the supplied runner when awaited.
 *
 * @template TExpect - The assertion API exposed through the verification context.
 * @param runner - The executor used for all step variants.
 * @param defaultExpect - The default assertion implementation for normal checks.
 * @param softExpect - The assertion implementation used for soft checks.
 * @param symbol - A debug label used as the step's string tag.
 * @returns A function that creates a lazy orchestrate step from a title, originFn, and verifyFn.
 */
export const createOrchestrateStep = <TExpect>(
  runner: StepRunner,
  defaultExpect: TExpect,
  softExpect: TExpect,
  symbol = 'OrchestrateStep'
) => {
  const buildContextStep = createContextStep<VerifyContextOf<TExpect>>(runner, symbol)

  return <TRaw, TResult>(
    title: string,
    originFn: () => TRaw | Promise<TRaw>,
    verifyFn: (raw: TRaw, ctx: VerifyContextOf<TExpect>) => TResult | Promise<TResult>
  ): GenericOrchestrateStep<TRaw, TResult, TExpect> => {

    /**
     * Binds a specific expect instance into verifyFn, producing the closed-form
     * transformFn that ResourceStep's action slot executes.
     *
     * Relation: transformFn(expect) = (raw) => verifyFn(raw, { expect })
     */
    const bindTransform = (expectInstance: TExpect) =>
      async () => {
        const raw = await originFn()
        return verifyFn(raw, { expect: expectInstance })
      }

    const baseStep = buildContextStep<TResult>(
      title,
      bindTransform(defaultExpect),
      { expect: defaultExpect }
    )

    const runRaw = () => runner(`${title} (raw)`, originFn)

    return Object.assign(baseStep, {
      title,
      originFn,
      transformFn: bindTransform(defaultExpect),
      verifyFn,
      raw: runRaw,

      with: (expectImpl: TExpect) =>
        buildContextStep<TResult>(title, bindTransform(expectImpl), { expect: expectImpl }),

      soft: () =>
        buildContextStep<TResult>(`${title} (soft)`, bindTransform(softExpect), { expect: softExpect }),
    })
  }
}
