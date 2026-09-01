/**
 * Factory that produces a capability bound to a target.
 */
export type AbilityFactory<
  TDependency,
  TTarget,
  TResult,
> = (
  dependency: TDependency,
  target: TTarget,
) => TResult

/**
 * Associates a dependency with a set of abilities.
 */
export type Binding<
  TDependency,
  TAbilities,
> = {
  dependency: TDependency
  abilities: TAbilities
}

/**
 * Creates a reusable binding.
 */
export const bind = <
  TDependency,
  TAbilities,
>(
    dependency: TDependency,
    abilities: TAbilities,
  ): Binding<TDependency, TAbilities> => ({
    dependency,
    abilities,
  })

type AbilityResult<T> =
  T extends (...args: never[]) => infer TResult
    ? TResult
    : never

type BoundAbilities<TBinding> =
  TBinding extends Binding<unknown, infer TAbilities>
    ? {
        [K in keyof TAbilities]:
          AbilityResult<TAbilities[K]>
      }
    : never

type UnionToIntersection<T> =
  (
    T extends unknown
      ? (value: T) => void
      : never
  ) extends (value: infer TResult) => void
    ? TResult
    : never
/**
 * Applies bindings to a target and returns the enhanced object.
 */
export const enhance = <
  TBase,
  const TBindings extends readonly Binding<unknown, unknown>[],
>(
    base: TBase,
    ...bindings: TBindings
  ) =>
  ({
    ...base,
    ...Object.assign(
      {},
      ...bindings.map(({ dependency, abilities }) =>
        Object.fromEntries(
          Object.entries(
            abilities as Record<
              string,
              (dependency: unknown, target: TBase) => unknown
            >,
          ).map(([name, ability]) => [
            name,
            ability(dependency, base),
          ]),
        ),
      ),
    ),
  }) as TBase &
    UnionToIntersection<
      BoundAbilities<TBindings[number]>
    >