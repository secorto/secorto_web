import { expect } from "@playwright/test"

export type StepExpect = typeof expect
export type Action<T> = (expect: StepExpect) => T | Promise<T>
export type Verification<T> = Action<T>
export type StepBody<T> = Action<T>
export type StepResult<T> = Promise<T>

export type StepDefinition<T> = {
  title: string
  action: Action<T>
}

export const step = <T>(title: string, action: Action<T>): StepDefinition<T> => ({ title, action })

export type GherkinStep = <T>(definition: StepDefinition<T>, stepExpect?: StepExpect) => StepResult<T>

type StepRunner = {
  step: <R>(name: string, fn: () => R | Promise<R>) => Promise<R>
}

export const createVerb = (verb: string, runner: StepRunner): GherkinStep => {
  return async <T>(definition: StepDefinition<T>, stepExpect: StepExpect = expect) => {
    return await runner.step(`${verb} ${definition.title}`, () => definition.action(stepExpect))
  }
}
