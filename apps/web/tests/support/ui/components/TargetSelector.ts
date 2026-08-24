import type { Locator } from '@playwright/test'
import { target, type Target } from './Target'

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

export function targetSelector<T>(
  parent: string,
  resolve: (value: T) => Locator,
  valueLabel: (value: T) => string = (value: T) => `${String(value)}`,
): TargetSelector<T, Target> {
  return new TargetSelector(parent, resolve, valueLabel, target)
}

export function specializedTargetSelector<T, TTarget extends Target>(
  factory: (name: string, locator: Locator) => TTarget,
  parent: string,
  resolve: (value: T) => Locator,
  valueLabel: (value: T) => string = (value: T) => `${String(value)}`,
): TargetSelector<T, TTarget> {
  return new TargetSelector(parent, resolve, valueLabel, factory)
}
