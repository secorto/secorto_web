import { test as base, expect } from '@playwright/test'
import {
  createStep,
  type Action,
  type StepDefinition,
} from './gherkin'

export type StepExpect = {expect: typeof expect}
const { step, createVerb } = createStep<StepExpect>({expect})

export type GherkinStep = <T>(definition: StepDefinition<T, StepExpect>, stepExpect?: StepExpect) => Promise<T>
export type GherkinStepDefinition<T> = {
  title: string
  action: Action<T, StepExpect>
}

type GherkinFixtures = {
  Given: GherkinStep
  When: GherkinStep
  Then: GherkinStep
  And: GherkinStep
  But: GherkinStep
}

export const test = base.extend<GherkinFixtures>({
  Given: async ({}, use) => {
    await use(createVerb('Given', base))
  },
  When: async ({}, use) => {
    await use(createVerb('When', base))
  },
  Then: async ({}, use) => {
    await use(createVerb('Then', base))
  },
  And: async ({}, use) => {
    await use(createVerb('And', base))
  },
  But: async ({}, use) => {
    await use(createVerb('But', base))
  }
})

export const Act = createVerb('Act', base)
export const Verify = createVerb('Verify', base)

export { expect, step }
