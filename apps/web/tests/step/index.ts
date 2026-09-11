import { expect, test } from '@playwright/test'
import {
  createTestingStep,
  type GenericVerification,
  type GenericOrchestrateStep,
} from '@secorto/step'

export type ExpectLike = typeof expect | typeof expect.soft
export type Verification<T> = GenericVerification<T, ExpectLike>
export type OrchestrateStep<TOrigin, TResult = void> = GenericOrchestrateStep<TOrigin, TResult, ExpectLike>
export const { step, verifyStep, resourceStep, orchestrateStep } = createTestingStep(test.step, expect, expect.soft)
export type { Step, ResourceStep } from '@secorto/step'
