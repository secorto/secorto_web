import type { Step, StepRunner } from './execution'

/**
 * Shared base contract for any step that holds a raw origin source.
 *
 * Both ResourceStep and GenericOrchestrateStep extend this interface,
 * expressing the invariant that they can bypass their transformation layer
 * and resolve directly with the pristine origin payload via `.raw()`.
 */
export interface WithOrigin<TRaw> {
  originFn: () => TRaw | Promise<TRaw>
  raw: () => Promise<TRaw>
}

/**
 * A lazy resource step that manages two functions: originFn (source of truth)
 * and transformFn (parser/mapper).
 *
 * Default behavior chains both: originFn executes, result flows into transformFn,
 * and the promise resolves with transformFn's result (the parsed domain value).
 *
 * `.raw()` bypasses transformFn entirely and resolves with the pristine origin payload.
 *
 * The object can be inspected before execution (title, originFn, transformFn, action)
 * and awaited as a normal promise.
 */
export interface ResourceStep<TRaw, TParsed> extends Step<TParsed>, WithOrigin<TRaw> {
  transformFn: (raw: TRaw) => TParsed | Promise<TParsed>
}

/**
 * Creates a reusable resource step factory backed by a specific runner.
 *
 * Each generated resource step stores its title, originFn, and transformFn,
 * then executes them through the supplied runner when the step is awaited.
 *
 * @param runner - The function responsible for executing a named step and
 * returning its result.
 * @param symbol - A debug label used as the step's string tag.
 * @returns A function that creates a lazy resource step definition from a title,
 * originFn, and transformFn.
 */
export const createResourceStep =
  (runner: StepRunner, symbol: string) =>
  <TRaw, TParsed>(
      title: string,
      originFn: () => TRaw | Promise<TRaw>,
      transformFn: (raw: TRaw) => TParsed | Promise<TParsed>
    ): ResourceStep<TRaw, TParsed> => {
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

    return {
      title,
      originFn,
      transformFn,
      action,
      raw: runRaw,
      then: (onFulfilled, onRejected) => run().then(onFulfilled, onRejected),
      [Symbol.toStringTag]: symbol
    }
  }
