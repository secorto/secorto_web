import { bind, enhance } from '@secorto/target'
import { describe, expect, it } from 'vitest'


describe('enhance', () => {
  it('preserves base properties', () => {
    const result = enhance({
      name: 'cosito',
      locator: '#cosito',
    })

    expect(result.name).toBe('cosito')
    expect(result.locator).toBe('#cosito')
  })

  it('materializes abilities', () => {
    const result = enhance(
      {
        name: 'cosito',
      },
      bind('step', {
        doSomething:
          (dependency: string, target: { name: string }) =>
            () => `${dependency}:${target.name}`,
      }),
    )

    expect(result.doSomething()).toBe('step:cosito')
  })

  it('injects dependency into abilities', () => {
    const result = enhance(
      {},
      bind('hello', {
        greeting:
          (dependency: string, _target: object) =>
            () => dependency,
      }),
    )

    expect(result.greeting()).toBe('hello')
  })

  it('provides target to abilities', () => {
    const result = enhance(
      {
        name: 'cosito',
      },
      bind({}, {
        getName:
          (_dependency: object, target: { name: string }) =>
            () => target.name,
      }),
    )

    expect(result.getName()).toBe('cosito')
  })

  it('supports multiple bindings', () => {
    const result = enhance(
      {
        name: 'cosito',
      },
      bind('action', {
        action:
          (dependency: string, _target: { name: string }) =>
            () => dependency,
      }),
      bind('verification', {
        verification:
          (dependency: string, _target: { name: string }) =>
            () => dependency,
      }),
    )

    expect(result.action()).toBe('action')
    expect(result.verification()).toBe('verification')
  })

  it('supports empty bindings', () => {
    const result = enhance(
      {
        name: 'cosito',
      },
      bind({}, {}),
    )

    expect(result.name).toBe('cosito')
  })

  it('merges abilities from multiple bindings', () => {
    const result = enhance(
      {
        value: 123,
      },
      bind('a', {
        first:
          (dependency: string, _target: { value: number }) =>
            () => dependency,
      }),
      bind('b', {
        second:
          (dependency: string, _target: { value: number }) =>
            () => dependency,
      }),
      bind('c', {
        third:
          (dependency: string, _target: { value: number }) =>
            () => dependency,
      }),
    )

    expect(result.first()).toBe('a')
    expect(result.second()).toBe('b')
    expect(result.third()).toBe('c')
  })

  it('supports async abilities', async () => {
    const result = enhance(
      {},
      bind('hello', {
        asyncAction:
          (dependency: string, _target: object) =>
            async () => dependency,
      }),
    )

    await expect(result.asyncAction()).resolves.toBe('hello')
  })

  it('allows abilities from different bindings to access the same target', () => {
    const result = enhance(
      {
        value: 123,
      },
      bind('first', {
        getValue:
          (_dependency: string, target: { value: number }) =>
            () => target.value,
      }),
      bind('second', {
        doubleValue:
          (_dependency: string, target: { value: number }) =>
            () => target.value * 2,
      }),
    )

    expect(result.getValue()).toBe(123)
    expect(result.doubleValue()).toBe(246)
  })

  it('last binding wins when ability names collide', () => {
    const result = enhance(
      {},
      bind('first', {
        action: (d: object) => () => d,
      }),
      bind('second', {
        action: (d: object) => () => d,
      }),
    )

    expect(result.action()).toBe('second')
  })

  it('returns target when no bindings are provided', () => {
    const result = enhance({ value: 1 })

    expect(result.value).toBe(1)
  })

  it('supports ability parameters', () => {
    const result = enhance(
      {},
      bind('hello', {
        greet:
          (dependency: object) =>
            (name: string) => `${dependency} ${name}`,
      }),
    )

    expect(result.greet('Sergio')).toBe('hello Sergio')
  })
})