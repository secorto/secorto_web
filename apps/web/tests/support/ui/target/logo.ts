import type { Locator } from '@playwright/test'
import { target, type TargetComponent } from './target'

export type Logo = TargetComponent

export function logo(name: string, locator: Locator): Logo {
  return target(name, locator)
}
