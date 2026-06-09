import type { Locator } from '@playwright/test'
import type { UILanguages } from '@i18n/ui'
import { step } from '@tests/fixtures'

export class Comments {
  constructor(
    readonly script: Locator,
    readonly frame: Locator,
  ) {}

  shouldBeReady(locale: UILanguages) {
    return step('detail has comments section', async ({ expect }) => {
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
