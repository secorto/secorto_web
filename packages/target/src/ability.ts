/**
 * An Enhancer represents a polymorphic function that knows how to materialize
 * its abilities over a specific target, carrying along the type of the abilities.
 */
export interface Enhancer<TTarget, TAbilities> {
  (target: TTarget): Record<string, unknown>
  /** Phantom property to let TypeScript keep track of the types */
  _abilities?: TAbilities
}

/**
 * Binds abilities over a target, optionally accepting a trailing dependency.
 * The ability functions will receive arguments in the following order: (target, dependency).
 */
export const withAbilities = <
  TAbilities extends Record<string, unknown>,
  TDependency = undefined,
  TTarget = unknown
>(
  abilities: TAbilities,
  dependency?: TDependency,
): Enhancer<TTarget, TAbilities> => {
  return (target: TTarget) =>
    Object.fromEntries(
      Object.entries(abilities).map(([name, ability]) => [
        name,
        // Target goes first; dependency is sent at the end (will be undefined if not provided)
        (ability as (t: TTarget, d?: TDependency) => unknown)(target, dependency),
      ])
    )
}

// --- TYPE INFERENCE UTILITIES (TS) ---

type AbilityResult<T> =
  // Using never[] here allows matching functions with any parameter types safely
  T extends (...args: never[]) => infer TResult
    ? TResult
    : never

type InferAbilities<TEnhancer> =
  TEnhancer extends Enhancer<any, infer TAbilities>
    ? {
        [K in keyof TAbilities]: AbilityResult<TAbilities[K]>
      }
    : never


type UnionToIntersection<T> =
  (T extends unknown ? (value: T) => void : never) extends (value: infer TResult) => void
    ? TResult
    : never

/**
 * Applies enhancers to a base object polymorphically.
 */
export const enhance = <
  TBase,
  const TEnhancers extends readonly Enhancer<TBase, Record<string, unknown>>[],
>(
  base: TBase,
  ...enhancers: TEnhancers
) => {
  const mergedAbilities = Object.assign(
    {},
    ...enhancers.map((enhanceFn) => enhanceFn(base))
  )

  return {
    ...base,
    ...mergedAbilities,
  } as TBase & UnionToIntersection<InferAbilities<TEnhancers[number]>>
}
