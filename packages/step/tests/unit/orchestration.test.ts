import { describe, it, expect, vi } from 'vitest'
import { createTestingStep } from '@secorto/step'
import type { StepRunner } from '@secorto/step'

type MockAssertion = { toBe: (expected: unknown) => void }
type MockExpect = (actual: unknown) => MockAssertion

const createMockExpect = (): MockExpect => (actual: unknown) => ({
  toBe: (expected: unknown) => {
    if (actual !== expected) throw new Error('Mismatch')
  },
})

describe('createTestingStep (Integration Bundle)', () => {
  let capturedTitle: string | undefined

  const mockRunner: StepRunner = async (title, action) => {
    capturedTitle = title
    return action()
  }

  const expectMock = createMockExpect()

  describe('factory bootstrapping', () => {
    it('initializes all four core factories lazily without immediate side-effects', () => {
      // Arrange & Act
      const bundle = createTestingStep(mockRunner, expectMock, expectMock)

      // Assert
      expect(typeof bundle.step).toBe('function')
      expect(typeof bundle.verifyStep).toBe('function')
      expect(typeof bundle.contractStep).toBe('function')
      expect(typeof bundle.contractVerifyStep).toBe('function')
      expect(capturedTitle).toBeUndefined()
    })
  })

  describe('step factory boundary', () => {
    it('produces functional pure action steps integrated with the configured runner', async () => {
      // Arrange
      const { step } = createTestingStep(mockRunner, expectMock, expectMock)

      // Act
      const pureStepDef = step('open homepage', async () => 'navigated')
      const result = await pureStepDef

      // Assert
      expect(pureStepDef.title).toBe('open homepage')
      expect(result).toBe('navigated')
      expect(capturedTitle).toBe('open homepage')
    })
  })

  describe('verifyStep factory boundary', () => {
    it('produces functional verification steps that receive the default expect provider', async () => {
      // Arrange
      const { verifyStep } = createTestingStep(mockRunner, expectMock, expectMock)

      // Act
      const verifyStepDef = verifyStep('validate total', ({ expect }) => {
        expect(10).toBe(10)
        return 'verified'
      })
      const result = await verifyStepDef

      // Assert
      expect(verifyStepDef.title).toBe('validate total')
      expect(result).toBe('verified')
      expect(capturedTitle).toBe('validate total')
    })
  })

  describe('contractStep factory boundary', () => {
    it('produces functional contract steps chaining origin and transform blocks', async () => {
      // Arrange
      const { contractStep } = createTestingStep(mockRunner, expectMock, expectMock)

      // Act
      const contractStepDef = contractStep('fetch user', () => ({ id: 1 }), (raw) => raw.id)
      const result = await contractStepDef

      // Assert
      expect(contractStepDef.title).toBe('fetch user')
      expect(result).toBe(1)
      expect(capturedTitle).toBe('fetch user')
    })
  })

  describe('contractVerifyStep factory boundary', () => {
    it('produces functional integrated streams checking data and assertions simultaneously', async () => {
      // Arrange
      const { contractVerifyStep } = createTestingStep(mockRunner, expectMock, expectMock)

      // Act
      const contractVerifyStepDef = contractVerifyStep('sync balance', () => 500, (raw, { expect }) => {
        expect(raw).toBe(500)
        return 'synced'
      })
      const result = await contractVerifyStepDef

      // Assert
      expect(contractVerifyStepDef.title).toBe('sync balance')
      expect(result).toBe('synced')
      expect(capturedTitle).toBe('sync balance')
    })
  })
})
