import { describe, it, expect, vi } from 'vitest'
import { expect as playwrightExpect } from '@playwright/test'
import { createPlaywrightStep } from '@secorto/step/playwright'

describe('playwright adapter', () => {
  const mockRunner = vi.fn(async (_title, action) => action())
  const { step, verifyStep } = createPlaywrightStep(mockRunner)

  it('exposes the title and action metadata', () => {
    const action = () => 42
    const value = step('plain action', action)

    expect(value.title).toBe('plain action')
    expect(value.action).toBe(action)
  })

  it('calls the step runner with the title and action', async () => {
    const result = await step('plain action', () => 42)
    expect(result).toBe(42)
    expect(mockRunner).toHaveBeenCalledWith('plain action', expect.any(Function))
  })

  it('accepts the default Playwright expect callback', async () => {
    let called = false

    await verifyStep('verification with expect', ({ expect }) => {
      called = true
      expect(called).toBe(true)
    })

    expect(called).toBe(true)
  })

  it('resolves with the action result', async () => {
    const result = verifyStep('verification with override', ({ expect }) => {
      expect('value').toBe('value')
      return 'done'
    })

    await expect(result).resolves.toBe('done')
  })

  it('overrides the expect implementation via .with()', async () => {
    const result = verifyStep('verification with override', ({ expect }) => {
      expect('value').toBe('value')
      return 'done'
    }).with(playwrightExpect)

    await expect(result).resolves.toBe('done')
  })

  it('accepts expect.soft as a .with() override', async () => {
    const result = verifyStep('verification with override soft', ({ expect }) => {
      expect('value').toBe('value')
      return 'done'
    }).with(playwrightExpect.soft)

    await expect(result).resolves.toBe('done')
  })

  it('supports the .soft() shorthand', async () => {
    const result = verifyStep('verification with soft', ({ expect }) => {
      expect(true).toBe(true)
      return 'ok'
    }).soft()

    expect(result.title).toBe('verification with soft (soft)')
    await expect(result).resolves.toBe('ok')
  })
})
