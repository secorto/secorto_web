import { withAbilities, createTarget } from '@secorto/target'
import { describe, expect, it, expectTypeOf } from 'vitest'

describe('createTarget', () => {
  it('supports targets without bindings', () => {
    const result = createTarget(
      'title',
      '#title',
    )

    expect(result.name).toBe('title')
    expect(result.element).toBe('#title')
  })

  it('supports targets with a single binding accessing target properties', () => {
    const result = createTarget(
      'submit-btn',
      '.btn-primary',
      withAbilities({
        // Interacts directly with 'name' and 'element' properties
        click:
          (target: { name: string; element: string }, dependency: string) =>
            () => `Clicking ${target.name} via ${target.element} [Env: ${dependency}]`,
      }, 'production'),
    )

    expect(result.name).toBe('submit-btn')
    expect(result.element).toBe('.btn-primary')
    expect(result.click()).toBe('Clicking submit-btn via .btn-primary [Env: production]')
  })

  it('supports targets with multiple bindings piping or mutating logic', () => {
    const result = createTarget(
      'main-input',
      'input[type="text"]',
      withAbilities({
        // First binding reads the base target layout
        getSelector:
          (target: { element: string }) =>
            () => target.element,
      }),
      withAbilities({
        // Second binding combines target details with its own discrete dependency
        identify:
          (target: { name: string }, prefix: string) =>
            () => `${prefix}-${target.name}`,
      }, 'id'),
    )

    expect(result.name).toBe('main-input')
    expect(result.element).toBe('input[type="text"]')
    expect(result.getSelector()).toBe('input[type="text"]')
    expect(result.identify()).toBe('id-main-input')
  })

  it('returns a frozen immutable object', () => {
    const result = createTarget('immutable-actor', '#actor')

    // 1. Verify at runtime that the object structure is frozen
    expect(Object.isFrozen(result)).toBe(true)

    // 2. Verify that mutations throw an error under strict mode execution
    expect(() => {
      // @ts-expect-error - Bypass TS compilation to assert runtime safety
      result.name = 'mutated'
    }).toThrow()

    expect(() => {
      // @ts-expect-error - Prevent hot-plugging arbitrary runtime methods
      result.newAbility = () => {}
    }).toThrow()

    // 3. Confirm original properties remain untampered
    expect(result.name).toBe('immutable-actor')
  })

  // --- TS TYPE TESTS ---
  it('infers perfect TypeScript types for the final actor object', () => {
    const result = createTarget(
      'cosito',
      '#cosito',
      withAbilities({
        doSomething: (target: { name: string }, d: string) => () => d,
      }, 'step'),
      withAbilities({
        greet: () => (user: string) => `hi ${user}`,
      })
    )

    // 1. Assert base property definitions carry through correctly
    expectTypeOf(result.name).toBeString()
    expectTypeOf(result.element).toBeString()

    // 2. Assert added capability signatures are fully mapped and accessible
    expectTypeOf(result.doSomething).toEqualTypeOf<() => string>()
    expectTypeOf(result.greet).toEqualTypeOf<(user: string) => string>()

    // 3. Assert complete intersection topology matching expected outcome
    expectTypeOf(result).toMatchTypeOf<{
      name: string
      element: string
      doSomething: () => string
      greet: (user: string) => string
    }>()
  })
})
