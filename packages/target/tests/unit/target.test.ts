import { bind, createTarget } from '@secorto/target'
import { describe, expect, it } from 'vitest'


describe('createTarget', () => {
  it('supports targets without bindings', () => {
    const result = createTarget(
      'title',
      '#title',
    )

    expect(result.name).toBe('title')
    expect(result.element).toBe('#title')
  })

  it('supports targets with a single binding', () => {
    const result = createTarget(
      'title',
      '#title',
      bind('step', {
        greet:
          (dependency: string, target: { name: string }) =>
            () => `${dependency}:${target.name}`,
      }),
    )

    expect(result.name).toBe('title')
    expect(result.element).toBe('#title')
    expect(result.greet()).toBe('step:title')
  })

  it('supports targets with multiple bindings', () => {
    const result = createTarget(
      'title',
      '#title',
      bind('a', {
        first: (d: string) => () => d,
      }),
      bind('b', {
        second: (d: string) => () => d,
      }),
    )

    expect(result.name).toBe('title')
    expect(result.element).toBe('#title')
    expect(result.first()).toBe('a')
    expect(result.second()).toBe('b')
  })
})
