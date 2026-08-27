import type { Page } from '@playwright/test'
import { AxeBuilder } from '@axe-core/playwright'
import type axe from 'axe-core'
import { contractStep, step, verifyStep, type ContractStep, type Verification } from '@tests/step'

export type A11y = ContractStep<axe.AxeResults, Verification<void>>

const DEFAULT_EXCLUDES = [
  '[data-netlify-deploy-id]',
  'iframe',
  'iframe *',
]

export function a11yFlow(page: Page) {
  return contractStep('audit a11y',
    async () =>
      await step('analyze a11y', async () => {
        const builder = new AxeBuilder({ page })
        DEFAULT_EXCLUDES.forEach(ex => builder.exclude(ex))
        return builder.analyze()
      }),
    (results: axe.AxeResults) =>
      verifyStep('verify a11y results', async ({ expect }) => {
        expect(results.violations ?? []).toEqual([])
      })
  )
}
