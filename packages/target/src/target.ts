import { Enhancer, enhance } from "./ability"

/**
 * Represents a target object that can be enhanced with abilities.
 * @template T - The type of the target's element.
 */
export type Target<T> = {
  name: string
  element: T
}

/**
 * Creates an immutable target enhanced with specific capabilities.
 */
export const createTarget = <
  T,
  const TEnhancers extends readonly Enhancer<Target<T>, Record<string, unknown>>[]
>(
  name: string,
  element: T,
  ...bindings: TEnhancers
) =>
  Object.freeze(
    enhance(
      {
        name,
        element,
      },
      ...bindings,
    )
  )
