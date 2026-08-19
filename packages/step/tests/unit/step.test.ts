import { describe, it, expect, vi } from 'vitest'
import { makeStep } from '../../src/step.ts'
import type { StepRunner } from '../../src/step.ts'

const mockRunner: StepRunner = (_title, action) =>
  Promise.resolve(action())

describe('makeStep', () => {
  it('exposes the title on the definition', () => {
    const step = makeStep(mockRunner, 'MyStep')
    const result = step('my step', () => 42)
    expect(result.title).toBe('my step')
  })

  it('exposes the action on the definition', () => {
    const step = makeStep(mockRunner, 'MyStep')
    const action = () => 42
    const result = step('my step', action)
    expect(result.action).toBe(action)
  })

  it('resolves with the return value of the action', async () => {
    const step = makeStep(mockRunner, 'MyStep')
    const result = await step('my step', () => 42)
    expect(result).toBe(42)
  })

  it('resolves with the return value of an async action', async () => {
    const step = makeStep(mockRunner, 'MyStep')
    const result = await step('my step', async () => 'hello')
    expect(result).toBe('hello')
  })

  it('calls the runner with the correct title', async () => {
    const runner = vi.fn<StepRunner>(mockRunner)
    const step = makeStep(runner, 'MyStep')
    await step('click the button', () => undefined)
    expect(runner).toHaveBeenCalledWith('click the button', expect.any(Function))
  })

  it('is thenable (.then)', async () => {
    const step = makeStep(mockRunner, 'MyStep')
    const result = await step('my step', () => 99).then((v) => v * 2)
    expect(result).toBe(198)
  })

  it('is catchable (.catch)', async () => {
    const failingRunner: StepRunner = () => Promise.reject(new Error('fail'))
    const step = makeStep(failingRunner, 'MyStep')
    const result = await step('my step', () => undefined).catch(() => 'caught')
    expect(result).toBe('caught')
  })

  it('supports .finally', async () => {
    const step = makeStep(mockRunner, 'MyStep')
    const spy = vi.fn()
    await step('my step', () => 1).finally(spy)
    expect(spy).toHaveBeenCalledOnce()
  })
})
