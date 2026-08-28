import type { Locator } from '@playwright/test'
import type { Target } from './Target'

export class TargetSelector<T, TTarget extends Target = Target> {
  constructor(
    readonly parent: string,
    readonly resolve: (value: T) => Locator,
    readonly valueLabel: (value: T) => string,
    readonly factory: (name: string, locator: Locator) => TTarget,
  ) {}

  get(value: T): TTarget {
    return this.factory(`${this.parent} "${this.valueLabel(value)}"`, this.resolve(value))
  }
}
