import { describe, it, expect, vi } from 'vitest'
import { createContractStep } from '@secorto/step'
import type { StepRunner } from '@secorto/step'

const mockRunner: StepRunner = async (_title, action) =>
  action()

describe('createContractStep', () => {
  describe('metadata exposure', () => {
    it('exposes the title on the definition', () => {
      const contractStep = createContractStep(mockRunner, 'MyContractStep')
      const result = contractStep('my contract', () => 42, (v) => v * 2)
      expect(result.title).toBe('my contract')
    })

    it('exposes the originFn on the definition', () => {
      const contractStep = createContractStep(mockRunner, 'MyContractStep')
      const originFn = () => 42
      const result = contractStep('my contract', originFn, (v) => v * 2)
      expect(result.originFn).toBe(originFn)
    })

    it('exposes the transformFn on the definition', () => {
      const contractStep = createContractStep(mockRunner, 'MyContractStep')
      const transformFn = (v: number) => v * 2
      const result = contractStep('my contract', () => 42, transformFn)
      expect(result.transformFn).toBe(transformFn)
    })

    it('exposes the action on the definition', () => {
      const contractStep = createContractStep(mockRunner, 'MyContractStep')
      const result = contractStep('my contract', () => 42, (v) => v * 2)
      expect(result.action).toBeDefined()
      expect(typeof result.action).toBe('function')
    })
  })

  describe('default behavior (chained execution)', () => {
    it('executes originFn and passes result to transformFn', async () => {
      const contractStep = createContractStep(mockRunner, 'MyContractStep')
      const result = await contractStep(
        'my contract',
        () => 5,
        (v) => v * 3
      )
      expect(result).toBe(15)
    })

    it('resolves with transformFn result when both are sync', async () => {
      const contractStep = createContractStep(mockRunner, 'MyContractStep')
      const result = await contractStep(
        'parse data',
        () => '{"value": 42}',
        (json) => JSON.parse(json).value
      )
      expect(result).toBe(42)
    })

    it('resolves with transformFn result when originFn is async', async () => {
      const contractStep = createContractStep(mockRunner, 'MyContractStep')
      const result = await contractStep(
        'fetch and parse',
        async () => '{"value": 42}',
        (json) => JSON.parse(json).value
      )
      expect(result).toBe(42)
    })

    it('resolves with transformFn result when transformFn is async', async () => {
      const contractStep = createContractStep(mockRunner, 'MyContractStep')
      const result = await contractStep(
        'fetch and parse',
        () => '{"value": 42}',
        async (json) => JSON.parse(json).value
      )
      expect(result).toBe(42)
    })

    it('resolves with transformFn result when both are async', async () => {
      const contractStep = createContractStep(mockRunner, 'MyContractStep')
      const result = await contractStep(
        'fetch and parse',
        async () => '{"value": 42}',
        async (json) => JSON.parse(json).value
      )
      expect(result).toBe(42)
    })

    it('forwards title to the runner', async () => {
      let seenTitle: string | undefined
      const runner: StepRunner = async (title, action) => {
        seenTitle = title
        return Promise.resolve(action())
      }

      const contractStep = createContractStep(runner, 'MyContractStep')
      await contractStep('my contract', () => 5, (v) => v * 3)

      expect(seenTitle).toBe('my contract')
    })
  })

  describe('.raw() method', () => {
    it('executes only originFn and resolves with its result', async () => {
      const contractStep = createContractStep(mockRunner, 'MyContractStep')
      const result = await contractStep(
        'my contract',
        () => 42,
        (v) => v * 2 // should not be called
      ).raw()
      expect(result).toBe(42)
    })

    it('does not execute transformFn', async () => {
      const transformFn = vi.fn((v: number) => v * 2)
      const contractStep = createContractStep(mockRunner, 'MyContractStep')

      await contractStep('my contract', () => 42, transformFn).raw()

      expect(transformFn).not.toHaveBeenCalled()
    })

    it('appends "(raw)" to the title for the runner', async () => {
      let seenTitle: string | undefined
      const runner: StepRunner = async (title, action) => {
        seenTitle = title
        return Promise.resolve(action())
      }

      const contractStep = createContractStep(runner, 'MyContractStep')
      await contractStep('my contract', () => 42, (v) => v * 2).raw()

      expect(seenTitle).toBe('my contract (raw)')
    })

    it('works with async originFn', async () => {
      const contractStep = createContractStep(mockRunner, 'MyContractStep')
      const result = await contractStep(
        'my contract',
        async () => 42,
        (v) => v * 2
      ).raw()
      expect(result).toBe(42)
    })
  })

  describe('.detailed() method', () => {
    it('returns object with parsed and raw keys', async () => {
      const contractStep = createContractStep(mockRunner, 'MyContractStep')
      const result = await contractStep(
        'my contract',
        () => 5,
        (v) => v * 3
      ).detailed()
      expect(result).toEqual({ parsed: 15, raw: 5 })
    })

    it('parsed is transformFn result', async () => {
      const contractStep = createContractStep(mockRunner, 'MyContractStep')
      const result = await contractStep(
        'parse data',
        () => '{"value": 42}',
        (json) => JSON.parse(json).value
      ).detailed()
      expect(result.parsed).toBe(42)
    })

    it('raw is originFn result', async () => {
      const contractStep = createContractStep(mockRunner, 'MyContractStep')
      const result = await contractStep(
        'parse data',
        () => '{"value": 42}',
        (json) => JSON.parse(json).value
      ).detailed()
      expect(result.raw).toBe('{"value": 42}')
    })

    it('works with async originFn', async () => {
      const contractStep = createContractStep(mockRunner, 'MyContractStep')
      const result = await contractStep(
        'my contract',
        async () => 5,
        (v) => v * 3
      ).detailed()
      expect(result).toEqual({ parsed: 15, raw: 5 })
    })

    it('works with async transformFn', async () => {
      const contractStep = createContractStep(mockRunner, 'MyContractStep')
      const result = await contractStep(
        'my contract',
        () => 5,
        async (v) => v * 3
      ).detailed()
      expect(result).toEqual({ parsed: 15, raw: 5 })
    })

    it('works with both async', async () => {
      const contractStep = createContractStep(mockRunner, 'MyContractStep')
      const result = await contractStep(
        'my contract',
        async () => 5,
        async (v) => v * 3
      ).detailed()
      expect(result).toEqual({ parsed: 15, raw: 5 })
    })

    it('appends "(detailed)" to the title for the runner', async () => {
      let seenTitle: string | undefined
      const runner: StepRunner = async (title, action) => {
        seenTitle = title
        return Promise.resolve(action())
      }

      const contractStep = createContractStep(runner, 'MyContractStep')
      await contractStep('my contract', () => 42, (v) => v * 2).detailed()

      expect(seenTitle).toBe('my contract (detailed)')
    })
  })

  describe('promise chain (.then, .catch, .finally)', () => {
    it('supports .then() on default (chained) behavior', async () => {
      const contractStep = createContractStep(mockRunner, 'MyContractStep')
      const result = await contractStep(
        'my contract',
        () => 5,
        (v) => v * 3
      ).then((v) => v + 1)
      expect(result).toBe(16)
    })

    it('supports .catch() on error', async () => {
      const failingRunner: StepRunner = () => Promise.reject(new Error('fail'))
      const contractStep = createContractStep(failingRunner, 'MyContractStep')
      const result = await contractStep(
        'my contract',
        () => 5,
        (v) => v * 3
      ).catch(() => 'caught')
      expect(result).toBe('caught')
    })

    it('supports .finally()', async () => {
      const contractStep = createContractStep(mockRunner, 'MyContractStep')
      const spy = vi.fn()
      await contractStep('my contract', () => 5, (v) => v * 3).finally(spy)
      expect(spy).toHaveBeenCalledOnce()
    })
  })

  describe('lazy evaluation', () => {
    it('stores metadata without executing functions', () => {
      const originFn = vi.fn(() => 42)
      const transformFn = vi.fn((v: number) => v * 2)
      const contractStep = createContractStep(mockRunner, 'MyContractStep')

      contractStep('my contract', originFn, transformFn)

      expect(originFn).not.toHaveBeenCalled()
      expect(transformFn).not.toHaveBeenCalled()
    })

    it('metadata is accessible before awaiting', () => {
      const originFn = () => 42
      const transformFn = (v: number) => v * 2
      const contractStep = createContractStep(mockRunner, 'MyContractStep')
      const step = contractStep('my contract', originFn, transformFn)

      expect(step.title).toBe('my contract')
      expect(step.originFn).toBe(originFn)
      expect(step.transformFn).toBe(transformFn)
    })
  })

  describe('error handling', () => {
    it('rejects when originFn throws', async () => {
      const contractStep = createContractStep(mockRunner, 'MyContractStep')
      const error = new Error('originFn failed')

      const promise = contractStep(
        'my contract',
        () => {
          throw error
        },
        (v) => v * 2
      )

      await expect(promise).rejects.toThrow('originFn failed')
    })

    it('rejects when originFn promise rejects', async () => {
      const contractStep = createContractStep(mockRunner, 'MyContractStep')
      const error = new Error('originFn async failed')

      const promise = contractStep(
        'my contract',
        async () => {
          throw error
        },
        (v) => v * 2
      )

      await expect(promise).rejects.toThrow('originFn async failed')
    })

    it('rejects when transformFn throws', async () => {
      const contractStep = createContractStep(mockRunner, 'MyContractStep')
      const error = new Error('transformFn failed')

      const promise = contractStep(
        'my contract',
        () => 42,
        () => {
          throw error
        }
      )

      await expect(promise).rejects.toThrow('transformFn failed')
    })

    it('rejects when transformFn promise rejects', async () => {
      const contractStep = createContractStep(mockRunner, 'MyContractStep')
      const error = new Error('transformFn async failed')

      const promise = contractStep(
        'my contract',
        () => 42,
        async () => {
          throw error
        }
      )

      await expect(promise).rejects.toThrow('transformFn async failed')
    })

    it('.raw() rejects when originFn throws', async () => {
      const contractStep = createContractStep(mockRunner, 'MyContractStep')
      const error = new Error('originFn failed')

      const promise = contractStep(
        'my contract',
        () => {
          throw error
        },
        (v) => v * 2
      ).raw()

      await expect(promise).rejects.toThrow('originFn failed')
    })

    it('.detailed() rejects when originFn throws', async () => {
      const contractStep = createContractStep(mockRunner, 'MyContractStep')
      const error = new Error('originFn failed')

      const promise = contractStep(
        'my contract',
        () => {
          throw error
        },
        (v) => v * 2
      ).detailed()

      await expect(promise).rejects.toThrow('originFn failed')
    })

    it('.detailed() rejects when transformFn throws', async () => {
      const contractStep = createContractStep(mockRunner, 'MyContractStep')
      const error = new Error('transformFn failed')

      const promise = contractStep(
        'my contract',
        () => 42,
        () => {
          throw error
        }
      ).detailed()

      await expect(promise).rejects.toThrow('transformFn failed')
    })
  })

  describe('runner invocation', () => {
    it('calls runner once for default behavior', async () => {
      const runner = vi.fn((_title, action) => Promise.resolve(action()))
      const contractStep = createContractStep(runner, 'MyContractStep')

      await contractStep('my contract', () => 5, (v) => v * 3)

      expect(runner).toHaveBeenCalledOnce()
    })

    it('calls runner once for .raw()', async () => {
      const runner = vi.fn((_title, action) => Promise.resolve(action()))
      const contractStep = createContractStep(runner, 'MyContractStep')

      await contractStep('my contract', () => 5, (v) => v * 3).raw()

      expect(runner).toHaveBeenCalledOnce()
    })

    it('calls runner once for .detailed() because it owns the full execution', async () => {
      const runner = vi.fn((_title, action) => Promise.resolve(action()))
      const contractStep = createContractStep(runner, 'MyContractStep')

      await contractStep('my contract', () => 5, (v) => v * 3).detailed()

      expect(runner).toHaveBeenCalledTimes(1)
    })
  })

  describe('type inference', () => {
    it('infers TRaw and TParsed correctly', async () => {
      const contractStep = createContractStep(mockRunner, 'MyContractStep')
      const result = await contractStep(
        'my contract',
        () => 'hello', // string (TRaw)
        (s) => s.length // number (TParsed)
      )

      // TypeScript should infer result as number
      const typed: number = result
      expect(typed).toBe(5)
    })

    it('.raw() returns TRaw', async () => {
      const contractStep = createContractStep(mockRunner, 'MyContractStep')
      const result = await contractStep(
        'my contract',
        () => 'hello',
        (s) => s.length
      ).raw()

      // TypeScript should infer result as string
      const typed: string = result
      expect(typed).toBe('hello')
    })

    it('.detailed() returns { parsed: TParsed; raw: TRaw }', async () => {
      const contractStep = createContractStep(mockRunner, 'MyContractStep')
      const result = await contractStep(
        'my contract',
        () => 'hello',
        (s) => s.length
      ).detailed()

      const typed: { parsed: number; raw: string } = result
      expect(typed.parsed).toBe(5)
      expect(typed.raw).toBe('hello')
    })
  })
})
