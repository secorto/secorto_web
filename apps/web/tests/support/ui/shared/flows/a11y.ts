import type { Page } from '@playwright/test'
import { AxeBuilder } from '@axe-core/playwright'
import type axe from 'axe-core'
import { orchestrateStep, step } from '@tests/step'
import type { OrchestrateStep } from '@tests/step'

export type A11y = OrchestrateStep<axe.AxeResults, void>

const DEFAULT_EXCLUDES = [
  '[data-netlify-deploy-id]',
  'iframe',
  'iframe *',
]

export function a11yFlow(page: Page) {
  return orchestrateStep('audit a11y',
    async () =>
      await step('analyze a11y', async () => {
        const builder = new AxeBuilder({ page })
        DEFAULT_EXCLUDES.forEach(ex => builder.exclude(ex))
        return builder.analyze()
      }),
    (results: axe.AxeResults, { expect }) => {
      expect(results.violations, 'verify a11y has no violations').toEqual([])
    }
  )
}
