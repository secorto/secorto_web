/**
 * @deprecated Use the framework-agnostic adapter exported from @secorto/step/adapter.
 * This Playwright wrapper remains available for backward compatibility only.
 */
import { expect as pwExpect, test } from '@playwright/test'
import type { StepRunner } from './step'
import {
  createTestingStep,
  type Verification as GenericVerification,
  type VerifyContextOf,
} from './adapter'

export type ExpectAdapter = typeof pwExpect | typeof pwExpect.soft
export type VerifyContext = VerifyContextOf<ExpectAdapter>
export type Verification<T> = GenericVerification<T, ExpectAdapter>

/**
 * @deprecated Prefer createTestingStep from @secorto/step/adapter.
 */
export const createPlaywrightStep = (runner: StepRunner = test.step) =>
  createTestingStep<ExpectAdapter>(runner, pwExpect, pwExpect.soft)

export const { step, verifyStep } = createPlaywrightStep()
