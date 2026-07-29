import type { Page } from '@playwright/test'
import { AxeBuilder } from '@axe-core/playwright'
import type axe from 'axe-core'
import { step, verifyStep, type Step, type Verification } from '@tests/fixtures'

export interface A11y {
  analyze(): Step<axe.AxeResults>
  verify(results: axe.AxeResults): Verification<void>
  audit(): Verification<void>
}

const DEFAULT_EXCLUDES = [
  '[data-netlify-deploy-id]',
  'iframe',
  'iframe *',
]

export function a11yFlow(page: Page) {
  const analyze = () =>
    step('analyze a11y', async () => {
      const builder = new AxeBuilder({ page })
      DEFAULT_EXCLUDES.forEach(ex => builder.exclude(ex))
      return builder.analyze()
    })

  const verify = (results: axe.AxeResults) =>
    verifyStep('verify a11y results', async ({ expect }) => {
      expect(results.violations ?? []).toEqual([])
    })

  const audit = () => {
    return verifyStep('audit a11y', async ({ expect }) => {
      const results = await analyze()
      await verify(results).with(expect)
    })
  }

  return { analyze, verify, audit }
}
