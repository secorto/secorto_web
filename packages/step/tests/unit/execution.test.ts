import { describe, it, expect } from 'vitest'
import { createStep } from '@secorto/step'
import type { StepRunner } from '@secorto/step'

const mockRunner: StepRunner = (_title, action) =>
  Promise.resolve(action())

describe('createStep', () => {
  it('exposes the title on the definition', () => {
    const step = createStep(mockRunner, 'MyStep')
    const result = step('my step', () => 42)
    expect(result.title).toBe('my step')
  })

  it('exposes the action on the definition', () => {
    const step = createStep(mockRunner, 'MyStep')
    const action = () => 42
    const result = step('my step', action)
    expect(result.action).toBe(action)
  })

  it('resolves with the return value of the action', async () => {
    const step = createStep(mockRunner, 'MyStep')
    const result = await step('my step', () => 42)
    expect(result).toBe(42)
  })

  it('resolves with the return value of an async action', async () => {
    const step = createStep(mockRunner, 'MyStep')
    const result = await step('my step', async () => 'hello')
    expect(result).toBe('hello')
  })

  it('preserves the action return type through the runner', async () => {
    const runner: StepRunner = async (_title, action) => action()
    const result = await runner('my step', () => 'hello')
    const typedResult: string = result
    expect(typedResult).toBe('hello')
  })

  it('forwards the provided title to the runner', async () => {
    let seenTitle: string | undefined
    const runner: StepRunner = async (title, action) => {
      seenTitle = title
      return Promise.resolve(action())
    }

    const step = createStep(runner, 'MyStep')
    await step('click the button', () => undefined)

    expect(seenTitle).toBe('click the button')
  })

  it('is thenable (.then)', async () => {
    const step = createStep(mockRunner, 'MyStep')
    const result = await step('my step', () => 99).then((v) => v * 2)
    expect(result).toBe(198)
  })
})
