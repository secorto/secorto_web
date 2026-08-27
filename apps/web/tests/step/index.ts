import { expect, test } from '@playwright/test'
import {
  createTestingStep,
  type GenericVerification,
} from '@secorto/step'

export type Verification<T> = GenericVerification<T, typeof expect | typeof expect.soft>
export const { step, verifyStep, contractStep } = createTestingStep(test.step, expect, expect.soft)
export type { Step, ContractStep } from '@secorto/step'
