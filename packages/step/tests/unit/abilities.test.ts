import { describe, expect, it } from 'vitest'
import { applyAbilities, type Ability } from '@secorto/step'

describe('applyAbilities', () => {
  it('applies a list of abilities to a value using a shared context', () => {
    const context = { mark: 'action' }
    const abilities: Ability<{ label: string }, typeof context>[] = [
      (ctx, item) => ({ ...item, label: `${item.label}:${ctx.mark}` }),
    ]

    const composed = applyAbilities(context, abilities)
      .reduce((value, ability) => ability(value), { label: 'base' })

    expect(composed).toEqual({ label: 'base:action' })
  })

  it('keeps the composition generic across runtime contexts', () => {
    const context = { mark: 'verify' }
    const abilities: Ability<{ label: string }, typeof context>[] = [
      (ctx, item) => ({ ...item, label: `${item.label}:${ctx.mark}` }),
    ]

    const composed = applyAbilities(context, abilities)
      .reduce((value, ability) => ability(value), { label: 'base' })

    expect(composed).toEqual({ label: 'base:verify' })
  })
})
