import { expect, test } from '@playwright/test'
import {
  createTestingStep,
  type GenericVerification,
  type GenericContractVerification,
} from '@secorto/step'

export type Verification<T> = GenericVerification<T, typeof expect | typeof expect.soft>
export type ContractVerification<TOrigin, TValidation = void> = GenericContractVerification<TOrigin, TValidation, typeof expect | typeof expect.soft>
export const { step, verifyStep, contractStep, contractVerifyStep } = createTestingStep(test.step, expect, expect.soft)
export type { Step, ContractStep } from '@secorto/step'
