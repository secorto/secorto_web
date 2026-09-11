import { describe, it, expect, vi } from 'vitest'
import { createResourceStep } from '@secorto/step'
import type { StepRunner } from '@secorto/step'

const mockRunner: StepRunner = async (_title, action) =>
  action()

describe('createResourceStep', () => {
  describe('metadata exposure', () => {
    it('exposes the title on the definition', () => {
      const resourceStep = createResourceStep(mockRunner, 'MyResourceStep')
      const result = resourceStep('my resource', () => 42, (v) => v * 2)
      expect(result.title).toBe('my resource')
    })

    it('exposes the originFn on the definition', () => {
      const resourceStep = createResourceStep(mockRunner, 'MyResourceStep')
      const originFn = () => 42
      const result = resourceStep('my resource', originFn, (v) => v * 2)
      expect(result.originFn).toBe(originFn)
    })

    it('exposes the transformFn on the definition', () => {
      const resourceStep = createResourceStep(mockRunner, 'MyResourceStep')
      const transformFn = (v: number) => v * 2
      const result = resourceStep('my resource', () => 42, transformFn)
      expect(result.transformFn).toBe(transformFn)
    })

    it('exposes the action on the definition', () => {
      const resourceStep = createResourceStep(mockRunner, 'MyResourceStep')
      const result = resourceStep('my resource', () => 42, (v) => v * 2)
      expect(result.action).toBeDefined()
      expect(typeof result.action).toBe('function')
    })
  })

  describe('default behavior (chained execution)', () => {
    it('executes originFn and passes result to transformFn', async () => {
      const resourceStep = createResourceStep(mockRunner, 'MyResourceStep')
      const result = await resourceStep('my resource', () => 5, (v) => v * 3)
      expect(result).toBe(15)
    })

    it('resolves with transformFn result when both are sync', async () => {
      const resourceStep = createResourceStep(mockRunner, 'MyResourceStep')
      const result = await resourceStep(
        'parse data',
        () => '{"value": 42}',
        (json) => JSON.parse(json).value
      )
      expect(result).toBe(42)
    })

    it('resolves with transformFn result when originFn is async', async () => {
      const resourceStep = createResourceStep(mockRunner, 'MyResourceStep')
      const result = await resourceStep(
        'fetch and parse',
        async () => '{"value": 42}',
        (json) => JSON.parse(json).value
      )
      expect(result).toBe(42)
    })

    it('resolves with transformFn result when transformFn is async', async () => {
      const resourceStep = createResourceStep(mockRunner, 'MyResourceStep')
      const result = await resourceStep(
        'fetch and parse',
        () => '{"value": 42}',
        async (json) => JSON.parse(json).value
      )
      expect(result).toBe(42)
    })

    it('resolves with transformFn result when both are async', async () => {
      const resourceStep = createResourceStep(mockRunner, 'MyResourceStep')
      const result = await resourceStep(
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
      const resourceStep = createResourceStep(runner, 'MyResourceStep')
      await resourceStep('my resource', () => 5, (v) => v * 3)
      expect(seenTitle).toBe('my resource')
    })
  })

  describe('.raw() method', () => {
    it('executes only originFn and resolves with its result', async () => {
      const resourceStep = createResourceStep(mockRunner, 'MyResourceStep')
      const result = await resourceStep('my resource', () => 42, (v) => v * 2).raw()
      expect(result).toBe(42)
    })

    it('does not execute transformFn', async () => {
      const transformFn = vi.fn((v: number) => v * 2)
      const resourceStep = createResourceStep(mockRunner, 'MyResourceStep')
      await resourceStep('my resource', () => 42, transformFn).raw()
      expect(transformFn).not.toHaveBeenCalled()
    })

    it('appends "(raw)" to the title for the runner', async () => {
      let seenTitle: string | undefined
      const runner: StepRunner = async (title, action) => {
        seenTitle = title
        return Promise.resolve(action())
      }
      const resourceStep = createResourceStep(runner, 'MyResourceStep')
      await resourceStep('my resource', () => 42, (v) => v * 2).raw()
      expect(seenTitle).toBe('my resource (raw)')
    })

    it('works with async originFn', async () => {
      const resourceStep = createResourceStep(mockRunner, 'MyResourceStep')
      const result = await resourceStep('my resource', async () => 42, (v) => v * 2).raw()
      expect(result).toBe(42)
    })
  })

  describe('promise chain (.then)', () => {
    it('supports .then() on default (chained) behavior', async () => {
      const resourceStep = createResourceStep(mockRunner, 'MyResourceStep')
      const result = await resourceStep('my resource', () => 5, (v) => v * 3).then((v) => v + 1)
      expect(result).toBe(16)
    })
  })

  describe('lazy evaluation', () => {
    it('stores metadata without executing functions', () => {
      const originFn = vi.fn(() => 42)
      const transformFn = vi.fn((v: number) => v * 2)
      const resourceStep = createResourceStep(mockRunner, 'MyResourceStep')
      resourceStep('my resource', originFn, transformFn)
      expect(originFn).not.toHaveBeenCalled()
      expect(transformFn).not.toHaveBeenCalled()
    })

    it('metadata is accessible before awaiting', () => {
      const originFn = () => 42
      const transformFn = (v: number) => v * 2
      const resourceStep = createResourceStep(mockRunner, 'MyResourceStep')
      const step = resourceStep('my resource', originFn, transformFn)
      expect(step.title).toBe('my resource')
      expect(step.originFn).toBe(originFn)
      expect(step.transformFn).toBe(transformFn)
    })
  })

  describe('error handling', () => {
    it('rejects when originFn throws', async () => {
      const resourceStep = createResourceStep(mockRunner, 'MyResourceStep')
      const promise = resourceStep('my resource', () => { throw new Error('originFn failed') }, (v) => v * 2)
      await expect(promise).rejects.toThrow('originFn failed')
    })

    it('rejects when originFn promise rejects', async () => {
      const resourceStep = createResourceStep(mockRunner, 'MyResourceStep')
      const promise = resourceStep('my resource', async () => { throw new Error('originFn async failed') }, (v) => v * 2)
      await expect(promise).rejects.toThrow('originFn async failed')
    })

    it('rejects when transformFn throws', async () => {
      const resourceStep = createResourceStep(mockRunner, 'MyResourceStep')
      const promise = resourceStep('my resource', () => 42, () => { throw new Error('transformFn failed') })
      await expect(promise).rejects.toThrow('transformFn failed')
    })

    it('rejects when transformFn promise rejects', async () => {
      const resourceStep = createResourceStep(mockRunner, 'MyResourceStep')
      const promise = resourceStep('my resource', () => 42, async () => { throw new Error('transformFn async failed') })
      await expect(promise).rejects.toThrow('transformFn async failed')
    })

    it('.raw() rejects when originFn throws', async () => {
      const resourceStep = createResourceStep(mockRunner, 'MyResourceStep')
      const promise = resourceStep('my resource', () => { throw new Error('originFn failed') }, (v) => v * 2).raw()
      await expect(promise).rejects.toThrow('originFn failed')
    })
  })

  describe('runner invocation', () => {
    it('calls runner once for default behavior', async () => {
      const runner = vi.fn((_title, action) => Promise.resolve(action()))
      const resourceStep = createResourceStep(runner, 'MyResourceStep')
      await resourceStep('my resource', () => 5, (v) => v * 3)
      expect(runner).toHaveBeenCalledOnce()
    })

    it('calls runner once for .raw()', async () => {
      const runner = vi.fn((_title, action) => Promise.resolve(action()))
      const resourceStep = createResourceStep(runner, 'MyResourceStep')
      await resourceStep('my resource', () => 5, (v) => v * 3).raw()
      expect(runner).toHaveBeenCalledOnce()
    })
  })

  describe('type inference', () => {
    it('infers TRaw and TParsed correctly', async () => {
      const resourceStep = createResourceStep(mockRunner, 'MyResourceStep')
      const result = await resourceStep('my resource', () => 'hello', (s) => s.length)
      const typed: number = result
      expect(typed).toBe(5)
    })

    it('.raw() returns TRaw', async () => {
      const resourceStep = createResourceStep(mockRunner, 'MyResourceStep')
      const result = await resourceStep('my resource', () => 'hello', (s) => s.length).raw()
      const typed: string = result
      expect(typed).toBe('hello')
    })
  })
})
