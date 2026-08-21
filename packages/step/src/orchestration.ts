import { createStep, type StepRunner } from './execution'
import { createContextStep } from './context'
import { createVerifyStep } from './verification'

/**
 * Creates a testing helper bundle around a step runner and assertion set.
 *
 * The returned object exposes a generic step factory and a verification-aware
 * variant built from the same runner, making it easy to work with a single
 * execution model across plain and assertion-based steps.
 *
 * @template TExpect - The assertion API shared by verification steps.
 * @param runner - The executor used for both plain and verification steps.
 * @param defaultExpect - The default assertion implementation for normal checks.
 * @param softExpect - The assertion implementation used for soft checks.
 * @returns An object containing `step` and `verifyStep` factories.
 */
export const createTestingStep = <TExpect>(
  runner: StepRunner,
  defaultExpect: TExpect,
  softExpect: TExpect
) => {
  return {
    step: createStep(runner, 'StepAction'),
    verifyStep: createVerifyStep(defaultExpect, softExpect, createContextStep(runner, 'VerifyStep')),
  }
}
