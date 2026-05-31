export type Action<T, E = unknown> = (args: E) => T | Promise<T>
export type StepResult<T> = Promise<T>

export type StepDefinition<T, E = unknown> = {
  title: string
  action: Action<T, E>
}

export const createStep = <E = unknown>(defaultValue: E) => {

  const step = <T>(title: string, action: Action<T, E>): StepDefinition<T, E> => ({ title, action })

  type GherkinStep = <T>(definition: StepDefinition<T, E>, stepExpect?: E) => StepResult<T>

  type StepRunner = {
    step: <R>(name: string, fn: () => R | Promise<R>) => Promise<R>
  }

  const createVerb = (verb: string, runner: StepRunner): GherkinStep => {
    return async <T>(definition: StepDefinition<T, E>, stepExpect?: E) => {
      const value = stepExpect ?? defaultValue
      return await runner.step(`${verb} ${definition.title}`, () => definition.action(value))
    }
  }

  return { step, createVerb }
}
