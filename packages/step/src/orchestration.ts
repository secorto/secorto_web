import { createStep, type StepRunner } from './execution'
import { createContextStep } from './context'
import { createVerifyStep } from './verification'
import { createContractStep } from './contract'
import { applyAbilities, type Ability } from './abilities'

/**
 * Creates a testing helper bundle around a step runner and assertion set.
 *
 * The returned bundle exposes the execution primitives (`step`, `verifyStep`,
 * `contractStep`) together with the generic ability composer used to enrich a
 * value with either action or verification capabilities.
 *
 * The semantic difference is intentional: `actions` binds the composition to the
 * step runner, while `verifications` binds it to the verification-aware runner.
 *
 * @template TExpect - The assertion API shared by verification steps.
 * @param runner - The executor used for plain, verification, and contract steps.
 * @param defaultExpect - The default assertion implementation for normal checks.
 * @param softExpect - The assertion implementation used for soft checks.
 * @returns An object containing `step`, `verifyStep`, `actions`, `verifications`, and `contractStep` factories.
 */
export const createTestingStep = <TExpect>(
  runner: StepRunner,
  defaultExpect: TExpect,
  softExpect: TExpect
) => {
  const step = createStep(runner, 'StepAction')
  const verifyStep = createVerifyStep(defaultExpect, softExpect, createContextStep(runner, 'VerifyStep'))
  return {
    step,
    verifyStep,
    actions: <T>(abilities: Ability<T, typeof step>[]) =>
      applyAbilities(step, abilities),
    verifications: <T>(abilities: Ability<T, typeof verifyStep>[]) =>
      applyAbilities(verifyStep, abilities),
    contractStep: createContractStep(runner, 'ContractStepAction'),
  }
}
