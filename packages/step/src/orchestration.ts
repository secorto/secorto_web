import { createStep, type StepRunner } from './execution'
import { createContextStep } from './context'
import { createVerifyStep } from './verification'
import { createContractStep } from './contract'

/**
 * Creates a testing helper bundle around a step runner and assertion set.
 *
 * The returned object exposes a generic step factory, a verification-aware
 * variant, and a contract step factory—all built from the same runner, making
 * it easy to work with a single execution model across plain, assertion-based,
 * and contract steps.
 *
 * @template TExpect - The assertion API shared by verification steps.
 * @param runner - The executor used for plain, verification, and contract steps.
 * @param defaultExpect - The default assertion implementation for normal checks.
 * @param softExpect - The assertion implementation used for soft checks.
 * @returns An object containing `step`, `verifyStep`, and `contractStep` factories.
 */
export const createTestingStep = <TExpect>(
  runner: StepRunner,
  defaultExpect: TExpect,
  softExpect: TExpect
) => {
  return {
    step: createStep(runner, 'StepAction'),
    verifyStep: createVerifyStep(defaultExpect, softExpect, createContextStep(runner, 'VerifyStep')),
    contractStep: createContractStep(runner, 'ContractStepAction'),
  }
}
