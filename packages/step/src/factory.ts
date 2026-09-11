import { createStep, type StepRunner } from './execution'
import { createContextStep } from './context'
import { createVerifyStep } from './verification'
import { createResourceStep } from './resource'
import { createOrchestrateStep } from './orchestration'

/**
 * Creates a testing helper bundle around a step runner and assertion set.
 *
 * The returned object exposes all four core step factories — all backed by the
 * same runner — making it easy to work with a single execution model across
 * plain, assertion-based, resource, and orchestration steps.
 *
 * @template TExpect - The assertion API shared by verification steps.
 * @param runner - The executor used for all step variants.
 * @param defaultExpect - The default assertion implementation for normal checks.
 * @param softExpect - The assertion implementation used for soft checks.
 * @returns An object containing `step`, `verifyStep`, `resourceStep`, and `orchestrateStep` factories.
 */
export const createTestingStep = <TExpect>(
  runner: StepRunner,
  defaultExpect: TExpect,
  softExpect: TExpect
) => {
  return {
    step: createStep(runner, 'StepAction'),
    verifyStep: createVerifyStep(defaultExpect, softExpect, createContextStep(runner, 'VerifyStep')),
    resourceStep: createResourceStep(runner, 'ResourceStep'),
    orchestrateStep: createOrchestrateStep(runner, defaultExpect, softExpect, 'OrchestrateStep'),
  }
}
