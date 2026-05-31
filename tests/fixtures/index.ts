import { test as base, expect } from '@playwright/test'
import {
  createVerb,
  step,
  type Action,
  type GherkinStep,
} from './gherkin'

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

export { expect, step, type Action }
