import { describe, it, expect } from 'vitest'
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
      const bundle = createTestingStep(mockRunner, expectMock, expectMock)

      expect(typeof bundle.step).toBe('function')
      expect(typeof bundle.verifyStep).toBe('function')
      expect(typeof bundle.resourceStep).toBe('function')
      expect(typeof bundle.orchestrateStep).toBe('function')
      expect(capturedTitle).toBeUndefined()
    })
  })

  describe('step factory boundary', () => {
    it('produces functional pure action steps integrated with the configured runner', async () => {
      const { step } = createTestingStep(mockRunner, expectMock, expectMock)

      const pureStepDef = step('open homepage', async () => 'navigated')
      const result = await pureStepDef

      expect(pureStepDef.title).toBe('open homepage')
      expect(result).toBe('navigated')
      expect(capturedTitle).toBe('open homepage')
    })
  })

  describe('verifyStep factory boundary', () => {
    it('produces functional verification steps that receive the default expect provider', async () => {
      const { verifyStep } = createTestingStep(mockRunner, expectMock, expectMock)

      const verifyStepDef = verifyStep('validate total', ({ expect }) => {
        expect(10).toBe(10)
        return 'verified'
      })
      const result = await verifyStepDef

      expect(verifyStepDef.title).toBe('validate total')
      expect(result).toBe('verified')
      expect(capturedTitle).toBe('validate total')
    })
  })

  describe('resourceStep factory boundary', () => {
    it('produces functional resource steps chaining origin and transform blocks', async () => {
      const { resourceStep } = createTestingStep(mockRunner, expectMock, expectMock)

      const resourceStepDef = resourceStep('fetch user', () => ({ id: 1 }), (raw) => raw.id)
      const result = await resourceStepDef

      expect(resourceStepDef.title).toBe('fetch user')
      expect(result).toBe(1)
      expect(capturedTitle).toBe('fetch user')
    })
  })

  describe('orchestrateStep factory boundary', () => {
    it('produces functional integrated streams checking data and assertions simultaneously', async () => {
      const { orchestrateStep } = createTestingStep(mockRunner, expectMock, expectMock)

      const orchestrateStepDef = orchestrateStep('sync balance', () => 500, (raw, { expect }) => {
        expect(raw).toBe(500)
        return 'synced'
      })
      const result = await orchestrateStepDef

      expect(orchestrateStepDef.title).toBe('sync balance')
      expect(result).toBe('synced')
      expect(capturedTitle).toBe('sync balance')
    })
  })
})
