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

  it('assembles the definitive 4-primitive testing bundle with lazy execution guarantees', () => {
    // Arrange
    const expectMock = createMockExpect()

    // Act
    const bundle = createTestingStep(runner, expectMock, expectMock)

    // Assert (Flawless bundle exposure)
    expect(typeof bundle.step).toBe('function')
    expect(typeof bundle.verifyStep).toBe('function')
    expect(typeof bundle.contractStep).toBe('function')
    expect(typeof bundle.contractVerifyStep).toBe('function')

    // Assert (Lazy verification: initialization must never trigger side-effects)
    expect(runner).not.toHaveBeenCalled()
  })
})
