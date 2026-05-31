import { expect } from "@playwright/test"

export type StepExpect = { expect: typeof expect }
export type Action<T> = (args: StepExpect) => T | Promise<T>
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

export const createVerb = (
  verb: string,
  runner: StepRunner,
  defaultValue: StepExpect = { expect }
): GherkinStep => {
  return async <T>(definition: StepDefinition<T>, stepExpect?: StepExpect) => {
    const value = stepExpect ?? defaultValue
    return await runner.step(`${verb} ${definition.title}`, () => definition.action(value))
  }
}
