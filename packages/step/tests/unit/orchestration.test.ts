import { describe, it, expect, vi } from 'vitest'
import { createOrchestrateStep } from '@secorto/step'
import type { StepRunner } from '@secorto/step'

type MockAssertion = { toBe: (expected: unknown) => void }
type MockExpect = (actual: unknown) => MockAssertion

const createMockExpect = (onMismatch: (actual: unknown, expected: unknown) => void): MockExpect =>
  (actual: unknown) => ({
    toBe: (expected: unknown) => {
      if (actual !== expected) onMismatch(actual, expected)
    },
  })

const mockRunner: StepRunner = async (_title, action) => action()

describe('createOrchestrateStep', () => {
  const defaultExpect = createMockExpect(() => { throw new Error('Strict failure') })
  const softExpect = createMockExpect(() => {})

  describe('metadata & lazy evaluation', () => {
    it('stores metadata and exposes properties without immediate execution', () => {
      const originFn = vi.fn(() => ({ id: '123', status: 'active' }))
      const verifyFn = vi.fn((raw, { expect }) => {
        expect(raw.status).toBe('active')
        return 'verified'
      })

      const orchestrateStep = createOrchestrateStep(mockRunner, defaultExpect, softExpect)
      const step = orchestrateStep('sync and verify', originFn, verifyFn)

      expect(step.title).toBe('sync and verify')
      expect(step.originFn).toBe(originFn)
      expect(step.verifyFn).toBe(verifyFn)

      expect(originFn).not.toHaveBeenCalled()
      expect(verifyFn).not.toHaveBeenCalled()
    })
  })

  describe('default behavior (chained execution)', () => {
    it('executes originFn first and forwards the result into verifyFn', async () => {
      const orchestrateStep = createOrchestrateStep(mockRunner, defaultExpect, softExpect)

      const step = orchestrateStep(
        'process stream',
        async () => ({ code: 200, payload: 'data' }),
        (raw, { expect }) => {
          expect(raw.code).toBe(200)
          return raw.payload.toUpperCase()
        }
      )

      const result = await step
      expect(result).toBe('DATA')
    })

    it('forwards the pristine title to the runner during standard execution', async () => {
      let seenTitle: string | undefined
      const customRunner: StepRunner = async (title, action) => {
        seenTitle = title
        return action()
      }

      const orchestrateStep = createOrchestrateStep(customRunner, defaultExpect, softExpect)
      await orchestrateStep('check account', () => 'active', (raw) => raw)
      expect(seenTitle).toBe('check account')
    })
  })

  describe('.raw() method', () => {
    it('executes only originFn and resolves directly with its pure payload', async () => {
      const orchestrateStep = createOrchestrateStep(mockRunner, defaultExpect, softExpect)

      const rawPayload = await orchestrateStep(
        'fetch configuration',
        () => ({ env: 'production', debug: false }),
        (_raw) => { throw new Error('verifyFn should not be called in .raw()') }
      ).raw()

      expect(rawPayload).toEqual({ env: 'production', debug: false })
    })

    it('bypasses verifyFn and assertions completely', async () => {
      const verifyFn = vi.fn((raw, _ctx) => raw)
      const orchestrateStep = createOrchestrateStep(mockRunner, defaultExpect, softExpect)
      await orchestrateStep('fetch profile', () => ({ name: 'John' }), verifyFn).raw()
      expect(verifyFn).not.toHaveBeenCalled()
    })

    it('appends "(raw)" to the step title for the runner boundary', async () => {
      let seenTitle: string | undefined
      const customRunner: StepRunner = async (title, action) => {
        seenTitle = title
        return action()
      }
      const orchestrateStep = createOrchestrateStep(customRunner, defaultExpect, softExpect)
      await orchestrateStep('get status', () => 'ok', (raw) => raw).raw()
      expect(seenTitle).toBe('get status (raw)')
    })
  })

  describe('runtime strategy control (.soft & .with)', () => {
    it('supports .soft() shorthand by inverting the expect provider into softExpect', async () => {
      let capturedExpect: any
      const orchestrateStep = createOrchestrateStep(mockRunner, defaultExpect, softExpect)

      const step = orchestrateStep(
        'validate layout',
        () => 'broken-state',
        (raw, { expect }) => {
          capturedExpect = expect
          expect(raw).toBe('correct-state')
          return 'soft-processed'
        }
      ).soft()

      expect(step.title).toBe('validate layout (soft)')
      const result = await step
      expect(result).toBe('soft-processed')
      expect(capturedExpect).toBe(softExpect)
    })

    it('overrides the active assertion engine via .with() dynamically', async () => {
      const customExpect = createMockExpect((actual, expected) => {
        throw new Error(`Custom mismatch: ${actual} vs ${expected}`)
      })

      const orchestrateStep = createOrchestrateStep(mockRunner, defaultExpect, softExpect)
      const step = orchestrateStep(
        'custom check',
        () => 'value',
        (raw, { expect }) => {
          expect(raw).toBe('mismatch')
          return 'failed'
        }
      ).with(customExpect)

      await expect(step).rejects.toThrow('Custom mismatch: value vs mismatch')
    })

    it('guarantees immutability when strategy modifiers are called', async () => {
      const orchestrateStep = createOrchestrateStep(mockRunner, defaultExpect, softExpect)

      const originalStep = orchestrateStep('immutable test', () => 'data', (raw) => raw)
      const softStep = originalStep.soft()

      expect(originalStep).not.toBe(softStep)
      expect(originalStep.title).toBe('immutable test')
      expect(softStep.title).toBe('immutable test (soft)')
    })
  })

  describe('error handling', () => {
    it('rejects the promise chain when originFn throws internally', async () => {
      const orchestrateStep = createOrchestrateStep(mockRunner, defaultExpect, softExpect)

      const promise = orchestrateStep(
        'flaky fetch',
        async () => { throw new Error('Network error') },
        (raw) => raw
      )

      await expect(promise).rejects.toThrow('Network error')
    })

    it('rejects the promise chain when verifyFn assertions fail in strict mode', async () => {
      const orchestrateStep = createOrchestrateStep(mockRunner, defaultExpect, softExpect)

      const promise = orchestrateStep(
        'strict validation',
        () => 'invalid-data',
        (raw, { expect }) => {
          expect(raw).toBe('valid-data')
          return 'ok'
        }
      )

      await expect(promise).rejects.toThrow('Strict failure')
    })
  })

  describe('promise chain (.then compatibility)', () => {
    it('supports native awaiting and standard resolution chaining', async () => {
      const orchestrateStep = createOrchestrateStep(mockRunner, defaultExpect, softExpect)

      const result = await orchestrateStep(
        'chain test',
        () => 10,
        (raw) => raw * 5
      ).then((val) => val + 2)

      expect(result).toBe(52)
    })
  })

  describe('transformFn is the bound verifyFn', () => {
    it('exposes transformFn as the closed-form of verifyFn with default expect', async () => {
      const orchestrateStep = createOrchestrateStep(mockRunner, defaultExpect, softExpect)
      const step = orchestrateStep('bound check', () => 42, (raw) => raw * 2)

      expect(typeof step.transformFn).toBe('function')
      const result = await step.transformFn(42)
      expect(result).toBe(84)
    })
  })
})
