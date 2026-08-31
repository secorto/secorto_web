import type { Step, StepRunner } from './execution'

/**
 * A lazy contract definition that manages two functions: originFn (source of truth)
 * and transformFn (parser/validator).
 *
 * Default behavior chains both: originFn executes, result flows to transformFn,
 * and the promise resolves with transformFn's result (parsed).
 *
 * `.raw()` executes only originFn and resolves with its result.
 * `.detailed()` executes both and resolves with {parsed, raw}.
 *
 * The object can be inspected before execution (title, originFn, transformFn, action)
 * and awaited as a normal promise.
 */
export interface ContractStep<TRaw, TParsed> extends Step<TParsed> {
  originFn: () => TRaw | Promise<TRaw>
  transformFn: (raw: TRaw) => TParsed | Promise<TParsed>
  raw: () => Promise<TRaw>
  /** @deprecated Return it from the final transformation yourself. */
  detailed: () => Promise<{ parsed: TParsed; raw: TRaw }>
}

/**
 * Creates a reusable contract step factory backed by a specific runner.
 *
 * Each generated contract step stores its title, originFn, and transformFn,
 * then executes them through the supplied runner when the step is awaited.
 *
 * @param runner - The function responsible for executing a named step and
 * returning its result.
 * @param symbol - A debug label used as the step's string tag.
 * @returns A function that creates a lazy contract step definition from a title,
 * originFn, and transformFn.
 */
export const createContractStep =
  (runner: StepRunner, symbol: string) =>
  <TRaw, TParsed>(
      title: string,
      originFn: () => TRaw | Promise<TRaw>,
      transformFn: (raw: TRaw) => TParsed | Promise<TParsed>
    ): ContractStep<TRaw, TParsed> => {
    /**
     * Default action: execute originFn, pass result to transformFn.
     */
    const action = async () => {
      const raw = await originFn()
      return transformFn(raw)
    }

    /**
     * Execute the default action (both functions chained).
     */
    const run = () => runner(title, action)

    /**
     * Execute only originFn (skip transformFn).
     */
    const runRaw = () => runner(`${title} (raw)`, originFn)

    /**
     * Execute both and collect results in a single runner call.
     * Returns { parsed, raw } to allow inspection of both phases.
     * Appears in report as a single step: "${title} (detailed)"
     */
    const runDetailed = () =>
      runner(`${title} (detailed)`, async () => {
        const raw = await originFn()
        const parsed = await transformFn(raw)
        return { parsed, raw }
      })

    return {
      title,
      originFn,
      transformFn,
      action,
      raw: runRaw,
      detailed: runDetailed,
      then: (onFulfilled, onRejected) => run().then(onFulfilled, onRejected),
      [Symbol.toStringTag]: symbol
    }
  }
