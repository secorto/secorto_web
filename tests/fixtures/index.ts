import { test, expect } from '@playwright/test'

type StepExpect = { expect: typeof expect }

export const step = <T>(
  title: string,
  action: (args: StepExpect) => T | Promise<T>
) => test.step(title, () => action({ expect }))

export { test, expect }
