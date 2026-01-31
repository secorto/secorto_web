import { AxeBuilder } from '@axe-core/playwright'
import type { Page } from '@playwright/test'

export const DEFAULT_EXCLUDES = ['[data-netlify-deploy-id]']

export const checkA11y =
  (excludes: string[] = DEFAULT_EXCLUDES) =>
  async ({ page }: { page: Page }) => {
    const builder = new AxeBuilder({ page })
    for (const ex of excludes) builder.exclude(ex)
    return await builder.analyze()
  }
