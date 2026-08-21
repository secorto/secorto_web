import { describe, it, expect, vi } from 'vitest'
import { createTestingStep } from '@secorto/step'
import type { StepRunner } from '@secorto/step'

type MockAssertion = { toBe: (expected: unknown) => void }
type MockExpect = (actual: unknown) => MockAssertion

const createMockExpect = (): MockExpect => (_actual: unknown) => ({
  toBe: () => {},
})

describe('createTestingStep (Integration Adapter)', () => {
  const runner: StepRunner = vi.fn(async (_title, action) => action())

  it('creates a testing bundle with both step helpers', () => {
    const expectMock = createMockExpect()
    const { step, verifyStep } = createTestingStep(runner, expectMock, expectMock)

    expect(typeof step).toBe('function')
    expect(typeof verifyStep).toBe('function')
    expect(runner).not.toHaveBeenCalled()
  })
})
