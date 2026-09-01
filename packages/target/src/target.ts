import { Binding, enhance } from "./ability";

export const createTarget = <
  T,
  const TBindings extends readonly Binding<unknown, unknown>[]
>(
    name: string,
    element: T,
    ...bindings: TBindings
  ) =>
    enhance(
      {
        name,
        element,
      },
      ...bindings,
    )