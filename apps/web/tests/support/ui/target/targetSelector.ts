import type { Locator } from '@playwright/test'
import type { Target } from './target'

export class TargetSelector<TValue, TTarget extends Target> {
  constructor(
    readonly parent: string,
    readonly resolve: (value: TValue) => Locator,
    readonly valueLabel: (value: TValue) => string,
    readonly factory: (name: string, locator: Locator) => TTarget,
  ) {}

  get(value: TValue): TTarget {
    return this.factory(`${this.parent} "${this.valueLabel(value)}"`, this.resolve(value))
  }
}

export function targetSelector<TValue, TTarget extends Target>(
  factory: (name: string, locator: Locator) => TTarget,
  parent: string,
  resolve: (value: TValue) => Locator,
  valueLabel: (value: TValue) => string = (value: TValue) => `${String(value)}`,
): TargetSelector<TValue, TTarget> {
  return new TargetSelector(parent, resolve, valueLabel, factory)
}
