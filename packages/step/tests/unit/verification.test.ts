import { describe, it, expect, vi } from 'vitest'
import { makeVerification } from '../../src/verification.ts'
import type { StepRunner } from '../../src/step.ts'

const mockRunner: StepRunner = (_title, action) =>
  Promise.resolve(action())

describe('makeVerification', () => {
  it('exposes the title on the definition', () => {
    const verifyStep = makeVerification(mockRunner, { expect })
    const result = verifyStep('my verification', () => undefined)
    expect(result.title).toBe('my verification')
  })

  it('exposes the action on the definition', () => {
    const verifyStep = makeVerification(mockRunner, { expect })
    const action = () => undefined
    const result = verifyStep('my verification', action)
    expect(result.action).toBe(action)
  })

  it('resolves with the return value of the action', async () => {
    const verifyStep = makeVerification(mockRunner, { expect })
    const result = await verifyStep('my verification', () => 42)
    expect(result).toBe(42)
  })

  it('resolves with the return value of an async action', async () => {
    const verifyStep = makeVerification(mockRunner, { expect })
    const result = await verifyStep('my verification', async () => 'hello')
    expect(result).toBe('hello')
  })

  it('injects the context into the action', async () => {
    const mockExpect = vi.fn()
    const verifyStep = makeVerification(mockRunner, { expect: mockExpect })
    await verifyStep('my verification', ({ expect: e }) => {
      e('value')
    })
    expect(mockExpect).toHaveBeenCalledWith('value')
  })

  it('calls the runner with the correct title', async () => {
    const runner = vi.fn<StepRunner>(mockRunner)
    const verifyStep = makeVerification(runner, { expect })
    await verifyStep('check the title', () => undefined)
    expect(runner).toHaveBeenCalledWith('check the title', expect.any(Function))
  })

  it('.with() overrides the context', async () => {
    const originalExpect = vi.fn()
    const newExpect = vi.fn()
    const verifyStep = makeVerification(mockRunner, { expect: originalExpect })

    await verifyStep('my verification', ({ expect: e }) => {
      e('value')
    }).with({ expect: newExpect })

    expect(originalExpect).not.toHaveBeenCalled()
    expect(newExpect).toHaveBeenCalledWith('value')
  })

  it('.with() merges partial context', async () => {
    type Ctx = { expect: ReturnType<typeof vi.fn>; softExpect: ReturnType<typeof vi.fn> }
    const mockExpect = vi.fn()
    const mockSoftExpect = vi.fn()
    const verifyStep = makeVerification<Ctx>(mockRunner, {
      expect: mockExpect,
      softExpect: mockSoftExpect,
    })

    let capturedCtx: Ctx | undefined
    await verifyStep('my verification', (ctx) => {
      capturedCtx = ctx
    }).with({ expect: vi.fn() })

    expect(capturedCtx?.expect).not.toBe(mockExpect)
    expect(capturedCtx?.softExpect).toBe(mockSoftExpect)
  })

  it('.with() returns a new ContextableStep', () => {
    const verifyStep = makeVerification(mockRunner, { expect })
    const derived = verifyStep('my verification', () => undefined).with({ expect })
    expect(derived.title).toBe('my verification')
  })

  it('is thenable (.then)', async () => {
    const verifyStep = makeVerification(mockRunner, { expect })
    const result = await verifyStep('my verification', () => 5).then(
      (v) => v * 2
    )
    expect(result).toBe(10)
  })

  it('is catchable (.catch)', async () => {
    const failingRunner: StepRunner = () => Promise.reject(new Error('fail'))
    const verifyStep = makeVerification(failingRunner, { expect })
    const result = await verifyStep('my verification', () => undefined).catch(
      () => 'caught'
    )
    expect(result).toBe('caught')
  })

  it('supports .finally', async () => {
    const verifyStep = makeVerification(mockRunner, { expect })
    const spy = vi.fn()
    await verifyStep('my verification', () => 1).finally(spy)
    expect(spy).toHaveBeenCalledOnce()
  })
})
