import { expect as pwExpect, test } from '@playwright/test'
import type { Step, StepRunner } from './step.ts'
import { makeStep } from './step.ts'

export type { Step } from './step.ts'

export type ExpectAdapter = typeof pwExpect | typeof pwExpect.soft
export type VerifyContext = { expect: ExpectAdapter }

export interface Verification<T> extends Step<T> {
  with(expectImpl: ExpectAdapter): Step<T>
  soft(): Step<T>
}

export const createPlaywrightStep = (runner: StepRunner = test.step) => {
  const step = makeStep(runner)

  return {
    step,
    verifyStep: <T>(
      title: string,
      action: (ctx: VerifyContext) => T | Promise<T>
    ): Verification<T> => {
      const build = (
        expectImpl: ExpectAdapter,
        nextTitle = title
      ): Step<T> => step<T>(nextTitle, () => action({ expect: expectImpl }))

      const base = build(pwExpect)

      return {
        ...base,
        with: (expectImpl: ExpectAdapter) => build(expectImpl),
        soft: () => build(pwExpect.soft, `${title} (soft)`),
      }
    },
  }
}

export const { step, verifyStep } = createPlaywrightStep()
