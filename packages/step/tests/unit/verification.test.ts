import { describe, it, expect, vi } from 'vitest'
import { createVerifyStep, createContextStep } from '@secorto/step'
import type { StepRunner } from '@secorto/step'

// Helpers de mock compartidos para aserciones
type MockAssertion = { toBe: (expected: unknown) => void }
type MockExpect = (actual: unknown) => MockAssertion

const createMockExpect = (onMismatch: (actual: unknown, expected: unknown) => void): MockExpect =>
  (actual: unknown) => ({
    toBe: (expected: unknown) => {
      if (actual !== expected) onMismatch(actual, expected)
    },
  })

describe('createVerifyStep', () => {
  const runner: StepRunner = vi.fn(async (_title, action) => action())

  it('creates an explicit verification factory with the same runner contract', async () => {
    const defaultExpect = createMockExpect(() => { throw new Error('should not fail') })
    const softExpect = createMockExpect(() => {})
    const verifyStep = createVerifyStep(defaultExpect, softExpect, createContextStep(runner, 'VerifyStep'))

    await verifyStep('verification from factory', ({ expect }) => {
      expect('value').toBe('value')
    })

    expect(runner).toHaveBeenCalledWith('verification from factory', expect.any(Function))
  })

  it('accepts the default expect callback for createVerifyStep', async () => {
    const defaultExpect = createMockExpect(() => { throw new Error('should not fail') })
    const softExpect = createMockExpect(() => {})
    const verifyStep = createVerifyStep(defaultExpect, softExpect, createContextStep(runner, 'VerifyStep'))
    let called = false

    await verifyStep('verification with expect', ({ expect }) => {
      called = true
      expect('value').toBe('value')
    })

    expect(called).toBe(true)
  })

  it('resolves with the action result for createVerifyStep', async () => {
    const defaultExpect = createMockExpect(() => { throw new Error('should not fail') })
    const softExpect = createMockExpect(() => {})
    const verifyStep = createVerifyStep(defaultExpect, softExpect, createContextStep(runner, 'VerifyStep'))

    const result = verifyStep('verification with override', ({ expect }) => {
      expect('value').toBe('value')
      return 'done'
    })

    await expect(result).resolves.toBe('done')
  })

  it('overrides the expect implementation via .with() for createVerifyStep', async () => {
    const defaultExpect = createMockExpect(() => { throw new Error('should not fail') })
    const softExpect = createMockExpect(() => {})
    const verifyStep = createVerifyStep(defaultExpect, softExpect, createContextStep(runner, 'VerifyStep'))

    const result = verifyStep('verification with override', ({ expect }) => {
      expect('value').toBe('value')
      return 'done'
    }).with(defaultExpect)

    await expect(result).resolves.toBe('done')
  })

  it('supports the .soft() shorthand for createVerifyStep', async () => {
    const defaultExpect = createMockExpect(() => { throw new Error('should not fail') })
    const softExpect = createMockExpect(() => {})
    const verifyStep = createVerifyStep(defaultExpect, softExpect, createContextStep(runner, 'VerifyStep'))

    const result = verifyStep('verification with soft', ({ expect }) => {
      expect(true).toBe(true)
      return 'ok'
    }).soft()

    expect(result.title).toBe('verification with soft (soft)')
    await expect(result).resolves.toBe('ok')
  })
})
