import type { Locator } from '@playwright/test'
import { step } from '@tests/fixtures'

export class Callout {
  constructor(readonly locator: Locator) {}

  shouldHavePyBAQ(i18n: Record<string, string>) {
    return step('pybaq callout uses i18n strings', async (expect) => {
      const callout = this.locator
      await expect(callout).toBeVisible()
      await expect(callout.getByText(i18n['home.pybaq_label'])).toBeVisible()
      await expect(callout.getByText(i18n['home.pybaq_role'])).toBeVisible()
      await expect(callout.getByText(i18n['home.pybaq_since'])).toBeVisible()
      await expect(callout.getByText(i18n['home.pybaq_cta'])).toBeVisible()
    })
  }
}

export function callout(locator: Locator) {
  return new Callout(locator)
}
