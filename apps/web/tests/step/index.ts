import { expect, test } from '@playwright/test'
import {
  createTestingStep,
  type GenericVerification,
} from '@secorto/step'

export type Verification<T> = GenericVerification<T, typeof expect | typeof expect.soft>
export const { step, verifyStep, contractStep } = createTestingStep(test.step, expect, expect.soft)
export type { Step } from '@secorto/step'

export type StepFn = typeof step
export type VerifyStepFn = typeof verifyStep

export {enhance, bind} from '@secorto/step'