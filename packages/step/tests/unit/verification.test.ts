import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  createVerifyStep,
  createContextStep,
  type VerifyContextOf,
} from '@secorto/step'

import type { StepRunner } from '@secorto/step'

type MockAssertion = {
  toBe: (expected: unknown) => void
}

type MockExpect = (
  actual: unknown
) => MockAssertion

type VerifyContext = VerifyContextOf<MockExpect>

const createMockExpect = (
  onMismatch: (
    actual: unknown,
    expected: unknown
  ) => void
): MockExpect =>
  (actual: unknown) => ({
    toBe: (expected: unknown) => {
      if (actual !== expected) {
        onMismatch(actual, expected)
      }
    },
  })

describe('createVerifyStep', () => {
  const runner: StepRunner = vi.fn(
    async (_title, action) => action()
  )

  beforeEach(() => {
    vi.clearAllMocks() // O vi.mocked(runner).mockClear()
  })

  const createFactory = (
    defaultExpect = createMockExpect(() => {
      throw new Error('Strict failure')
    }),
    softExpect = createMockExpect(() => {})
  ) =>
    createVerifyStep(
      defaultExpect,
      softExpect,
      createContextStep(runner, 'VerifyStep')
    )

  it('executes through the runner and resolves the callback result', async () => {
    const verifyStep = createFactory()

    const result = verifyStep(
      'verification',
      ({ expect }: VerifyContext) => {
        expect('value').toBe('value')
        return 'done'
      }
    )

    await expect(result).resolves.toBe('done')

    expect(runner).toHaveBeenCalledWith(
      'verification',
      expect.any(Function)
    )
  })

  it('preserves async return values from the verification callback', async () => {
    const verifyStep = createFactory()

    const result = verifyStep(
      'async verification',
      async ({ expect }) => {
        expect(true).toBe(true)
        return 'async-result'
      }
    )

    await expect(result).resolves.toBe(
      'async-result'
    )
  })

  it('overrides the expect implementation via .with()', async () => {
    const verifyStep = createFactory()

    const customExpect = createMockExpect(
      (actual, expected) => {
        throw new Error(
          `Custom mismatch: ${actual} vs ${expected}`
        )
      }
    )

    const result = verifyStep(
      'custom verification',
      ({ expect }) => {
        expect('a').toBe('b')
      }
    ).with(customExpect)

    await expect(result).rejects.toThrow(
      'Custom mismatch: a vs b'
    )
  })

  it('supports the .soft() shorthand and appends the title modifier', async () => {
    const verifyStep = createFactory()

    const result = verifyStep(
      'verification with soft',
      ({ expect }) => {
        expect('bad').toBe('good')
        return 'ok'
      }
    ).soft()

    expect(result.title).toBe(
      'verification with soft (soft)'
    )

    await expect(result).resolves.toBe('ok')
  })

  it('rejects when default expect fails', async () => {
    const verifyStep = createFactory()

    const result = verifyStep(
      'strict check',
      ({ expect }) => {
        expect('bad').toBe('good')
      }
    )

    await expect(result).rejects.toThrow(
      'Strict failure'
    )
  })

  it('supports promise chaining with then', async () => {
    const verifyStep = createFactory()

    const result = await verifyStep(
      'chain',
      () => 21
    ).then(value => value * 2)

    expect(result).toBe(42)
  })

  it('returns a new instance when soft() is called', () => {
    const verifyStep = createFactory()

    const original = verifyStep(
      'verification',
      () => 'ok'
    )

    const soft = original.soft()

    expect(original).not.toBe(soft)
    expect(original.title).toBe('verification')
    expect(soft.title).toBe('verification (soft)')
  })

  it('exposes a callable action independent of the runner', async () => {
    const verifyStep = createFactory()

    const step = verifyStep(
      'manual execution',
      ({ expect }) => {
        expect(true).toBe(true)
        return 42
      }
    )

    const result = await step.action()

    expect(result).toBe(42)
  })
})
