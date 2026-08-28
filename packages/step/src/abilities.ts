/**
 * A domain capability that enriches a target value using a runtime context.
 *
 * The `step` package treats capabilities as pure, composable transforms over a
 * value. The concrete domain (UI, forms, pages, etc.) decides what the value is
 * and which contexts are needed for actions or verifications.
 */
export type Ability<T, Context = unknown> = (
  context: Context,
  value: T,
) => T

/**
 * Applies a list of capabilities to a domain value using the supplied runtime
 * context.
 *
 * The function is intentionally generic: the same composition mechanism works for
 * action-oriented and verification-oriented abilities, as long as the context
 * matches the ability contract.
 */
export const applyAbilities = <T, Context = unknown>(
  context: Context,
  abilities: Ability<T, Context>[],
) => abilities.map((ability) => (value: T) => ability(context, value))
