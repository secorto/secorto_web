import { describe, it, expect, vi } from 'vitest'
import { createContextStep, makeStep } from '@secorto/step'
import { createTestingStep, makeVerifyStep } from '@secorto/step/adapter'

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

describe('testing adapter core', () => {
  const runner = vi.fn(async (_title, action) => action())

  it('creates a testing bundle with both step helpers', () => {
    const expectMock = createMockExpect(() => {})
    const { step, verifyStep } = createTestingStep(runner, expectMock, expectMock)

    expect(typeof step).toBe('function')
    expect(typeof verifyStep).toBe('function')
    expect(runner).not.toHaveBeenCalled()
  })

  it('exposes the title and action metadata for makeStep', () => {
    const step = makeStep(runner, 'StepAction')
    const action = () => 42
    const value = step('plain action', action)

    expect(value.title).toBe('plain action')
    expect(value.action).toBe(action)
  })

  it('calls the step runner with the title and action for makeStep', async () => {
    const step = makeStep(runner, 'StepAction')
    const result = await step('plain action', () => 42)

    expect(result).toBe(42)
    expect(runner).toHaveBeenCalledWith('plain action', expect.any(Function))
  })

  it('creates an explicit verification factory with the same runner contract', async () => {
    const defaultExpect = createMockExpect(() => {
      throw new Error('should not fail')
    })
    const softExpect = createMockExpect(() => {})

    const verifyStep = makeVerifyStep(runner, defaultExpect, softExpect)

    await verifyStep('verification from factory', ({ expect }) => {
      expect('value').toBe('value')
    })

    expect(runner).toHaveBeenCalledWith(
      'verification from factory',
      expect.any(Function)
    )
  })

  it('injects a fixed context through createContextStep', async () => {
    const withUser = createContextStep<{ userId: string }>(runner, 'UserStep')

    const result = await withUser('load profile', ({ userId }) => {
      return userId
    }, { userId: 'u_123' })

    expect(result).toBe('u_123')
    expect(runner).toHaveBeenCalledWith('load profile', expect.any(Function))
  })

  it('accepts the default expect callback for makeVerifyStep', async () => {
    const defaultExpect = createMockExpect(() => {
      throw new Error('should not fail')
    })
    const softExpect = createMockExpect(() => {})
    const verifyStep = makeVerifyStep(runner, defaultExpect, softExpect)
    let called = false

    await verifyStep('verification with expect', ({ expect }) => {
      called = true
      expect('value').toBe('value')
    })

    expect(called).toBe(true)
  })

  it('resolves with the action result for makeVerifyStep', async () => {
    const defaultExpect = createMockExpect(() => {
      throw new Error('should not fail')
    })
    const softExpect = createMockExpect(() => {})
    const verifyStep = makeVerifyStep(runner, defaultExpect, softExpect)
    const result = verifyStep('verification with override', ({ expect }) => {
      expect('value').toBe('value')
      return 'done'
    })

    await expect(result).resolves.toBe('done')
  })

  it('overrides the expect implementation via .with()', async () => {
    const defaultExpect = createMockExpect(() => {
      throw new Error('should not fail')
    })
    const softExpect = createMockExpect(() => {})
    const verifyStep = makeVerifyStep(runner, defaultExpect, softExpect)
    const result = verifyStep('verification with override', ({ expect }) => {
      expect('value').toBe('value')
      return 'done'
    }).with(defaultExpect)

    await expect(result).resolves.toBe('done')
  })

  it('accepts a soft expect as .with() override', async () => {
    const mismatch = vi.fn()
    const defaultExpect = createMockExpect((actual, expected) => {
      mismatch(actual, expected)
      throw new Error(`expected ${String(expected)} but got ${String(actual)}`)
    })
    const softExpect = createMockExpect((actual, expected) => {
      mismatch(actual, expected)
    })
    const verifyStep = makeVerifyStep(runner, defaultExpect, softExpect)
    const result = verifyStep('verification with override soft', ({ expect }) => {
      expect('value').toBe('value')
      return 'done'
    }).with(softExpect)

    await expect(result).resolves.toBe('done')
    expect(mismatch).not.toHaveBeenCalled()
  })

  it('supports the .soft() shorthand', async () => {
    const defaultExpect = createMockExpect(() => {
      throw new Error('should not fail')
    })
    const softExpect = createMockExpect(() => {})
    const verifyStep = makeVerifyStep(runner, defaultExpect, softExpect)
    const result = verifyStep('verification with soft', ({ expect }) => {
      expect(true).toBe(true)
      return 'ok'
    }).soft()

    expect(result.title).toBe('verification with soft (soft)')
    await expect(result).resolves.toBe('ok')
  })

  it('allows the caller to inject a generic expect adapter', async () => {
    const mismatch = vi.fn()
    const defaultExpect = createMockExpect((actual, expected) => {
      mismatch(actual, expected)
      throw new Error(`expected ${String(expected)} but got ${String(actual)}`)
    })
    const softExpect = createMockExpect((actual, expected) => {
      mismatch(actual, expected)
    })
    const verifyStep = makeVerifyStep(runner, defaultExpect, softExpect)

    const result = verifyStep('custom verification', ({ expect }) => {
      expect('value').toBe('value')
      return 'done'
    }).with(defaultExpect)

    await expect(result).resolves.toBe('done')
    expect(result.title).toBe('custom verification')
    expect(mismatch).not.toHaveBeenCalled()
  })
})
