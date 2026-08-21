import { describe, it, expect, vi } from 'vitest'
import { makeStep } from '@secorto/step'
import { createTestingStep } from '@secorto/step/adapter'

type MockAssertion = {
  toBe: (expected: unknown) => void
  toEqual: (expected: unknown) => void
}

type MockExpect = (actual: unknown) => MockAssertion

const createMockExpect =
  (onMismatch: (actual: unknown, expected: unknown) => void): MockExpect =>
  (actual: unknown) => ({
    toBe: (expected: unknown) => {
      if (actual !== expected) onMismatch(actual, expected)
    },
    toEqual: (expected: unknown) => {
      if (actual !== expected) onMismatch(actual, expected)
    },
  })

const createMockStepHarness = () => {
  const runner = vi.fn(async (_title, action) => action())
  const mismatch = vi.fn()

  const defaultExpect = createMockExpect((actual, expected) => {
    mismatch(actual, expected)
    throw new Error(`expected ${String(expected)} but got ${String(actual)}`)
  })

  const softExpect = createMockExpect((actual, expected) => {
    mismatch(actual, expected)
  })

  const stepFactory = createTestingStep(
    runner,
    defaultExpect,
    softExpect,
    <TResult>(
      title: string,
      action: (ctx: { expect: MockExpect }) => TResult | Promise<TResult>,
      expectImpl: MockExpect
    ) => makeStep(runner, 'GenericStep')<TResult>(title, () => action({ expect: expectImpl }))
  )

  return {
    ...stepFactory,
    runner,
    mismatch,
    defaultExpect,
    softExpect,
  }
}

describe('testing adapter core', () => {
  it('exposes the title and action metadata', () => {
    const { step } = createMockStepHarness()
    const action = () => 42
    const value = step('plain action', action)

    expect(value.title).toBe('plain action')
    expect(value.action).toBe(action)
  })

  it('calls the step runner with the title and action', async () => {
    const { step, runner } = createMockStepHarness()
    const result = await step('plain action', () => 42)

    expect(result).toBe(42)
    expect(runner).toHaveBeenCalledWith('plain action', expect.any(Function))
  })

  it('accepts the default expect callback', async () => {
    const { verifyStep } = createMockStepHarness()
    let called = false

    await verifyStep('verification with expect', ({ expect }) => {
      called = true
      expect('value').toBe('value')
    })

    expect(called).toBe(true)
  })

  it('resolves with the action result', async () => {
    const { verifyStep } = createMockStepHarness()
    const result = verifyStep('verification with override', ({ expect }) => {
      expect('value').toBe('value')
      return 'done'
    })

    await expect(result).resolves.toBe('done')
  })

  it('overrides the expect implementation via .with()', async () => {
    const { verifyStep, defaultExpect } = createMockStepHarness()
    const result = verifyStep('verification with override', ({ expect }) => {
      expect('value').toBe('value')
      return 'done'
    }).with(defaultExpect)

    await expect(result).resolves.toBe('done')
  })

  it('accepts a soft expect as .with() override', async () => {
    const { verifyStep, softExpect, mismatch } = createMockStepHarness()
    const result = verifyStep('verification with override soft', ({ expect }) => {
      expect('value').toBe('value')
      return 'done'
    }).with(softExpect)

    await expect(result).resolves.toBe('done')
    expect(mismatch).not.toHaveBeenCalled()
  })

  it('supports the .soft() shorthand', async () => {
    const { verifyStep } = createMockStepHarness()
    const result = verifyStep('verification with soft', ({ expect }) => {
      expect(true).toBe(true)
      return 'ok'
    }).soft()

    expect(result.title).toBe('verification with soft (soft)')
    await expect(result).resolves.toBe('ok')
  })

  it('allows the caller to inject a generic expect adapter', async () => {
    const { verifyStep, defaultExpect, mismatch } = createMockStepHarness()

    const result = verifyStep('custom verification', ({ expect }) => {
      expect('value').toBe('value')
      return 'done'
    }).with(defaultExpect)

    await expect(result).resolves.toBe('done')
    expect(result.title).toBe('custom verification')
    expect(mismatch).not.toHaveBeenCalled()
  })
})
