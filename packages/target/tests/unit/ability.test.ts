import { withAbilities, enhance } from '@secorto/target'
import { describe, expect, it, expectTypeOf } from 'vitest'

describe('enhance', () => {
  it('returns target when no bindings are provided', () => {
    const result = enhance({ value: 1, name: 'cosito' })

    expect(result.value).toBe(1)
    expect(result.name).toBe('cosito')
  })

  it('materializes multiple abilities inside a single binding', () => {
    const result = enhance(
      {
        name: 'cosito',
      },
      withAbilities({
        doSomething:
          (target: { name: string }, dependency: string) =>
            () => `something:${dependency}:${target.name}`,
        doOtherThing:
          (target: { name: string }, dependency: string) =>
            () => `other:${dependency}:${target.name}`,
      }, 'step'),
    )

    expect(result.doSomething()).toBe('something:step:cosito')
    expect(result.doOtherThing()).toBe('other:step:cosito')
  })

  it('merges abilities from multiple bindings interacting with target', () => {
    const result = enhance(
      {
        value: 10,
      },
      withAbilities({
        multiply:
          (target: { value: number }, dependency: number) =>
            () => target.value * dependency,
      }, 2),
      withAbilities({
        add:
          (target: { value: number }, dependency: number) =>
            () => target.value + dependency,
      }, 5),
      withAbilities({
        describe:
          (target: { value: number }, dependency: string) =>
            () => `${dependency}: ${target.value}`,
      }, 'Total'),
    )

    expect(result.multiply()).toBe(20)
    expect(result.add()).toBe(15)
    expect(result.describe()).toBe('Total: 10')
  })

  it('supports empty bindings without altering target', () => {
    const result = enhance(
      {
        name: 'cosito',
      },
      withAbilities({}, {}),
    )

    expect(result.name).toBe('cosito')
  })

  it('last binding wins when ability names collide', () => {
    const result = enhance(
      {},
      withAbilities({
        action: (_target: object, d: string) => () => d,
      }, 'first'),
      withAbilities({
        action: (_target: object, d: string) => () => d,
      }, 'second'),
    )

    expect(result.action()).toBe('second')
  })

  it('supports dynamic ability parameters', () => {
    const result = enhance(
      {},
      withAbilities({
        greet:
          (_target: object, dependency: string) =>
            (name: string) => `${dependency} ${name}`,
      }, 'hello'),
    )

    expect(result.greet('Sergio')).toBe('hello Sergio')
  })

  // --- TESTS DE TIPOS (TS) ---
  it('infers perfect TypeScript types for the enhanced object', () => {
    const result = enhance(
      { name: 'cosito', version: 1 },
      withAbilities({
        doSomething: (_target: { name: string }, d: string) => () => d,
        doOther: (_target: { name: string }, d: string) => () => d,
      }, 'step'),
      withAbilities({
        greet: () => (user: string) => `hi ${user}`,
      })
    )

    // 1. Valida que mantenga los tipos de las propiedades base
    expectTypeOf(result.name).toBeString()
    expectTypeOf(result.version).toBeNumber()

    // 2. Valida que infiera correctamente las firmas de las habilidades añadidas
    expectTypeOf(result.doSomething).toEqualTypeOf<() => string>()
    expectTypeOf(result.doOther).toEqualTypeOf<() => string>()
    expectTypeOf(result.greet).toEqualTypeOf<(user: string) => string>()

    // 3. Valida la estructura final por completo
    expectTypeOf(result).toMatchObjectType<{
      name: string
      version: number
      doSomething: () => string
      doOther: () => string
      greet: (user: string) => string
    }>()
  })
})
