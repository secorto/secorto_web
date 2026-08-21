import { describe, it, expect, vi } from 'vitest'
import { expect as playwrightExpect } from '@playwright/test'
import { createPlaywrightStep } from '@secorto/step/playwright'

describe('playwright compatibility wrapper', () => {
  it('uses Playwright expect by default', async () => {
    const mockRunner = vi.fn(async (_title, action) => action())
    const { verifyStep } = createPlaywrightStep(mockRunner)

    await expect(
      verifyStep('verification with expect', ({ expect }) => {
        expect(true).toBe(true)
        return 'done'
      })
    ).resolves.toBe('done')
  })

  it('accepts Playwright expect via .with()', async () => {
    const mockRunner = vi.fn(async (_title, action) => action())
    const { verifyStep } = createPlaywrightStep(mockRunner)

    await expect(
      verifyStep('verification with override', ({ expect }) => {
        expect('value').toBe('value')
        return 'done'
      }).with(playwrightExpect)
    ).resolves.toBe('done')
  })

  it('accepts Playwright soft expect via .with()', async () => {
    const mockRunner = vi.fn(async (_title, action) => action())
    const { verifyStep } = createPlaywrightStep(mockRunner)

    await expect(
      verifyStep('verification with soft override', ({ expect }) => {
        expect('value').toBe('value')
        return 'done'
      }).with(playwrightExpect.soft)
    ).resolves.toBe('done')
  })

  it('supports the .soft() shorthand', async () => {
    const mockRunner = vi.fn(async (_title, action) => action())
    const { verifyStep } = createPlaywrightStep(mockRunner)

    const result = verifyStep('verification with soft', ({ expect }) => {
      expect(true).toBe(true)
      return 'ok'
    }).soft()

    expect(result.title).toBe('verification with soft (soft)')
    await expect(result).resolves.toBe('ok')
  })
})
