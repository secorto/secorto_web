import { describe, it, expect, vi } from 'vitest'
import { createContractVerifyStep } from '@secorto/step'
import type { StepRunner } from '@secorto/step'

// Helpers de aserciones simuladas para los entornos de pruebas
type MockAssertion = { toBe: (expected: unknown) => void }
type MockExpect = (actual: unknown) => MockAssertion

const createMockExpect = (onMismatch: (actual: unknown, expected: unknown) => void): MockExpect =>
  (actual: unknown) => ({
    toBe: (expected: unknown) => {
      if (actual !== expected) onMismatch(actual, expected)
    },
  })

const mockRunner: StepRunner = async (_title, action) => action()

describe('createContractVerifyStep', () => {
  const defaultExpect = createMockExpect(() => { throw new Error('Strict failure') })
  const softExpect = createMockExpect(() => {}) // No arroja errores, simula modo blando

  describe('metadata & lazy evaluation', () => {
    it('stores metadata and exposes properties without immediate execution', () => {
      const originFn = vi.fn(() => ({ id: '123', status: 'active' }))
      const verifyFn = vi.fn((raw, { expect }) => {
        expect(raw.status).toBe('active')
        return 'verified'
      })

      const contractVerifyStep = createContractVerifyStep(mockRunner, defaultExpect, softExpect)
      const step = contractVerifyStep('sync and verify', originFn, verifyFn)

      // Los metadatos son accesibles públicamente en frío (meta-inspección)
      expect(step.title).toBe('sync and verify')
      expect(step.originFn).toBe(originFn)
      expect(step.verifyFn).toBe(verifyFn)

      // La evaluación diferida (lazy) garantiza que nada se ha ejecutado aún
      expect(originFn).not.toHaveBeenCalled()
      expect(verifyFn).not.toHaveBeenCalled()
    })
  })

  describe('default behavior (chained execution)', () => {
    it('executes originFn first and forwards the result into verifyFn', async () => {
      const contractVerifyStep = createContractVerifyStep(mockRunner, defaultExpect, softExpect)

      const step = contractVerifyStep(
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

      const contractVerifyStep = createContractVerifyStep(customRunner, defaultExpect, softExpect)
      const step = contractVerifyStep('check account', () => 'active', (raw) => raw)

      await step
      expect(seenTitle).toBe('check account')
    })
  })

  describe('.raw() method', () => {
    it('executes only originFn and resolves directly with its pure payload', async () => {
      const contractVerifyStep = createContractVerifyStep(mockRunner, defaultExpect, softExpect)

      const rawPayload = await contractVerifyStep(
        'fetch configuration',
        () => ({ env: 'production', debug: false }),
        (raw) => { throw new Error('verifyFn should not be called in .raw()') }
      ).raw()

      expect(rawPayload).toEqual({ env: 'production', debug: false })
    })

    it('bypasses verifyFn and assertions completely', async () => {
      const verifyFn = vi.fn((raw, { expect }) => raw)
      const contractVerifyStep = createContractVerifyStep(mockRunner, defaultExpect, softExpect)

      await contractVerifyStep('fetch profile', () => ({ name: 'John' }), verifyFn).raw()

      expect(verifyFn).not.toHaveBeenCalled()
    })

    it('appends "(raw)" to the step title for the runner boundary', async () => {
      let seenTitle: string | undefined
      const customRunner: StepRunner = async (title, action) => {
        seenTitle = title
        return action()
      }

      const contractVerifyStep = createContractVerifyStep(customRunner, defaultExpect, softExpect)
      await contractVerifyStep('get status', () => 'ok', (raw) => raw).raw()

      expect(seenTitle).toBe('get status (raw)')
    })
  })

  describe('runtime strategy control (.soft & .with)', () => {
    it('supports .soft() shorthand by inverting the expect provider into softExpect', async () => {
      let capturedExpect: any
      const contractVerifyStep = createContractVerifyStep(mockRunner, defaultExpect, softExpect)

      const step = contractVerifyStep(
        'validate layout',
        () => 'broken-state',
        (raw, { expect }) => {
          capturedExpect = expect
          expect(raw).toBe('correct-state') // Esto fallaría en modo estricto
          return 'soft-processed'
        }
      ).soft()

      // El título refleja la estrategia y se resuelve sin lanzar excepciones
      expect(step.title).toBe('validate layout (soft)')
      const result = await step
      expect(result).toBe('soft-processed')
      expect(capturedExpect).toBe(softExpect)
    })

    it('overrides the active assertion engine via .with() dynamically', async () => {
      const customExpect = createMockExpect((actual, expected) => {
        throw new Error(`Custom mismatch: ${actual} vs ${expected}`)
      })

      const contractVerifyStep = createContractVerifyStep(mockRunner, defaultExpect, softExpect)
      const step = contractVerifyStep(
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
      const contractVerifyStep = createContractVerifyStep(mockRunner, defaultExpect, softExpect)

      const originalStep = contractVerifyStep('immutable test', () => 'data', (raw) => raw)
      const softStep = originalStep.soft()

      // Ambas instancias apuntan a identidades funcionales independientes
      expect(originalStep).not.toBe(softStep)
      expect(originalStep.title).toBe('immutable test')
      expect(softStep.title).toBe('immutable test (soft)')
    })
  })

  describe('error handling', () => {
    it('rejects the promise chain when originFn throws internally', async () => {
      const contractVerifyStep = createContractVerifyStep(mockRunner, defaultExpect, softExpect)

      const promise = contractVerifyStep(
        'flaky fetch',
        async () => { throw new Error('Network error') },
        (raw) => raw
      )

      await expect(promise).rejects.toThrow('Network error')
    })

    it('rejects the promise chain when verifyFn assertions fail in strict mode', async () => {
      const contractVerifyStep = createContractVerifyStep(mockRunner, defaultExpect, softExpect)

      const promise = contractVerifyStep(
        'strict validation',
        () => 'invalid-data',
        (raw, { expect }) => {
          expect(raw).toBe('valid-data') // Arroja el error del defaultExpect
          return 'ok'
        }
      )

      await expect(promise).rejects.toThrow('Strict failure')
    })
  })

  describe('promise chain (.then compatibility)', () => {
    it('supports native awaiting and standard resolution chaining', async () => {
      const contractVerifyStep = createContractVerifyStep(mockRunner, defaultExpect, softExpect)

      const result = await contractVerifyStep(
        'chain test',
        () => 10,
        (raw) => raw * 5
      ).then((val) => val + 2)

      expect(result).toBe(52)
    })
  })
})
