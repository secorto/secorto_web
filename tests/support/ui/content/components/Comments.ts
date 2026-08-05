import type { Locator, Page } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { verifyStep } from '@tests/step'

export class Comments {
  constructor(
    readonly script: Locator,
    readonly frame: Locator,
  ) {}

  shouldBeReady(locale: UILanguages) {
    return verifyStep('detail has comments section', async ({ expect }) => {
      await expect(this.script).toHaveCount(1)
      await expect(this.script).toHaveAttribute('data-lang', locale)
      await expect(this.script).toHaveAttribute('data-repo', 'secorto/secorto_web')
      await expect(this.frame).toBeVisible()
    })
  }
}

export function comments(script: Locator, frame: Locator) {
  return new Comments(script, frame)
}

/**
 * Factory para Giscus comments.
 * Encapsula los selectores específicos de Giscus, eliminando duplicación.
 */
export function giscusComments(page: Page) {
  return comments(
    page.locator('.comments script[src*="giscus.app"]'),
    page.locator('iframe.giscus-frame'),
  )
}
