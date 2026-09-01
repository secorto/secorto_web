import { Enhancer, enhance } from "./ability";

/**
 * Creates an immutable target enhanced with specific capabilities.
 */
export const createTarget = <
  T,
  const TEnhancers extends readonly Enhancer<{ name: string; element: T }, Record<string, unknown>>[]
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
