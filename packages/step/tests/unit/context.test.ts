import { describe, it, expect, vi } from 'vitest'
import { createContextStep } from '@secorto/step'
import type { StepRunner } from '@secorto/step'

describe('createContextStep', () => {
  const runner: StepRunner = vi.fn(async (_title, action) => action())

  it('injects a fixed context through createContextStep', async () => {
    const withUser = createContextStep<{ userId: string }>(runner, 'UserStep')

    const result = await withUser('load profile', ({ userId }) => {
      return userId
    }, { userId: 'u_123' })

    expect(result).toBe('u_123')
    expect(runner).toHaveBeenCalledWith('load profile', expect.any(Function))
  })
})
