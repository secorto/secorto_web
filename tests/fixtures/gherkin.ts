import { test as base, expect } from '@playwright/test'

type StepExpect = typeof expect
export type Action<T> = (expect: StepExpect) => T | Promise<T>
export type Verification<T> = Action<T>
export type StepBody<T> = Action<T>
export type StepResult<T> = Promise<T>
type Verb = 'Given' | 'When' | 'Then' | 'And' | 'But' | 'Act' | 'Verify'

export type StepDefinition<T> = {
  title: string
  action: Action<T>
}

export const step = <T>(title: string, action: Action<T>): StepDefinition<T> => ({ title, action })

export type GherkinStep = <T>(definition: StepDefinition<T>, stepExpect?: StepExpect) => StepResult<T>

type GherkinFixtures = {
  Given: GherkinStep
  When: GherkinStep
  Then: GherkinStep
  And: GherkinStep
  But: GherkinStep
}

const createVerb = (verb: Verb): GherkinStep => {
  return async <T>(definition: StepDefinition<T>, stepExpect: StepExpect = expect) => {
    return await base.step(`${verb} ${definition.title}`, () => definition.action(stepExpect))
  }
}

export const test = base.extend<GherkinFixtures>({
  Given: async ({}, use) => {
    await use(createVerb('Given'))
  },
  When: async ({}, use) => {
    await use(createVerb('When'))
  },
  Then: async ({}, use) => {
    await use(createVerb('Then'))
  },
  And: async ({}, use) => {
    await use(createVerb('And'))
  },
  But: async ({}, use) => {
    await use(createVerb('But'))
  }
})

export const Act = createVerb('Act')
export const Verify = createVerb('Verify')

export { expect }
