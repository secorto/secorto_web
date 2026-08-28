import type { Locator, Page } from '@playwright/test'
import type { StepFn, VerifyStepFn } from '@secorto/step'
import { Target } from './Target'
import { Image } from './Image'
import { Link } from './Link'
import { PageHelper } from './PageHelper'
import { TargetSelector } from './TargetSelector'

export function createUIComponents(step: StepFn, verifyStep: VerifyStepFn) {
  const createTarget = (name: string, locator: Locator) =>
    new Target(name, locator, step, verifyStep)

  const createImage = (name: string, locator: Locator) =>
    new Image(name, locator, step, verifyStep)

  const createLink = (name: string, locator: Locator) =>
    new Link(name, locator, step, verifyStep)

  const createPageHelper = (page: Page) =>
    new PageHelper(page, verifyStep)

  const createTargetSelector = <T>(
    parent: string,
    resolve: (value: T) => Locator,
    valueLabel: (value: T) => string = (value: T) => `${String(value)}`,
  ) =>
    new TargetSelector(parent, resolve, valueLabel, createTarget)

  const createSpecializedTargetSelector = <T, TTarget extends Target>(
    factory: (name: string, locator: Locator) => TTarget,
    parent: string,
    resolve: (value: T) => Locator,
    valueLabel: (value: T) => string = (value: T) => `${String(value)}`,
  ) =>
    new TargetSelector(parent, resolve, valueLabel, factory)

  return {
    target: createTarget,
    image: createImage,
    link: createLink,
    pageHelper: createPageHelper,
    targetSelector: createTargetSelector,
    specializedTargetSelector: createSpecializedTargetSelector,
  }
}

export type UIComponents = ReturnType<typeof createUIComponents>
