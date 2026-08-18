import { test, expect } from '@playwright/test'
import { makeStep, makeVerification } from '@secorto/step'
import type { ContextableStep } from '@secorto/step'

type StepContext = { expect: typeof expect }

export type { Step } from '@secorto/step'

/**
 * A contextable step extended with Playwright-specific `.soft()` sugar.
 */
export interface Verification<T> extends ContextableStep<T, StepContext> {
  /**
   * Execute with soft expects: all failures are collected without early exit.
   */
  soft(): Verification<T>
}

const buildVerification = <T>(
  title: string,
  action: (ctx: StepContext) => T | Promise<T>,
  context: StepContext
): Verification<T> => {
  const base = makeVerification(test.step, context)(title, action)

  return Object.assign(base, {
    soft(): Verification<T> {
      return buildVerification(title, action, { expect: expect.soft })
    },
    with(newContext: Partial<StepContext>): Verification<T> {
      return buildVerification(title, action, { ...context, ...newContext })
    },
  }) as Verification<T>
}

/**
 * Defines a plain action step.
 * @param title Title of the step
 * @param action Action to be executed
 * @returns Return value of the action
 */
export const step = makeStep(test.step)

/**
 * Defines a verification step that can be executed with hard or soft expects.
 * @param title Title of verification
 * @param action Verification to be executed
 * @returns value of the action parameter
 */
export const verifyStep = <T>(
  title: string,
  action: (ctx: StepContext) => T | Promise<T>
): Verification<T> => buildVerification(title, action, { expect })
